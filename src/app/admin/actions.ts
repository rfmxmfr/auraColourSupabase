
'use server';

import { analyzeColor } from '@/ai/flows/color-analysis';
import { generateStyleReport } from '@/ai/flows/style-report-generator';
import { detectFace } from '@/ai/flows/face-detection';
import { updateSubmissionStatus, getSubmission, SubmissionStatus } from '@/services/submissionService';
import { supabase } from '@/lib/supabase';

export async function generateReportAction(submissionId: string, questionnaireResponses: string, photoDataUri: string) {
    try {
        await updateSubmissionStatus(submissionId, 'in progress');
        console.log(`Starting analysis for submission: ${submissionId}`);

        // 0. Verify face is in photo and quality is good
        const qualityCheck = await detectFace({ photoDataUri });
        console.log("Face detection result:", qualityCheck);

        if (!qualityCheck.faceDetected) {
            await updateSubmissionStatus(submissionId, 'paid'); // Revert status
            throw new Error(`Face detection failed: ${qualityCheck.reason}`);
        }
        if (qualityCheck.lightingQuality === 'poor' || qualityCheck.imageClarity === 'blurry') {
            await updateSubmissionStatus(submissionId, 'paid'); // Revert status
            throw new Error(`Image quality insufficient for analysis: ${qualityCheck.reason}`);
        }
        
        console.log("Face detection and quality check successful.");
        
        // 1. Perform color analysis
        const colorAnalysisResult = await analyzeColor({
            questionnaireResponses,
            photoDataUri,
        });

        console.log("Color analysis successful.");

        // 2. Generate style report
        const styleReportResult = await generateStyleReport({
            colorAnalysisResult: `Palette: ${colorAnalysisResult.colorPalette}, Tips: ${colorAnalysisResult.stylingTips}`,
            stylePreferences: questionnaireResponses,
            photoDataUri: photoDataUri,
        });
        
        console.log("Style report generation successful.");

        // 3. Save the report to Supabase
        const { error } = await supabase
            .from('submissions')
            .update({
                color_analysis: colorAnalysisResult,
                style_report: styleReportResult,
                status: 'completed',
                updated_at: new Date().toISOString()
            })
            .eq('id', submissionId);
            
        if (error) throw error;
        
        console.log("Report saved to Supabase.");

        return { success: true, report: { ...colorAnalysisResult, ...styleReportResult } };
    } catch (error: any) {
        console.error('Error generating report:', error);
        await updateSubmissionStatus(submissionId, 'paid'); // Revert status on failure
        // Check if error is an object with a message property
        const errorMessage = error.message || 'Failed to generate report.';
        return { success: false, error: errorMessage };
    }
}


export async function updateSubmissionStatusAction(submissionId: string, status: SubmissionStatus) {
    try {
        await updateSubmissionStatus(submissionId, status);
        return { success: true };
    } catch (error) {
        console.error('Error updating status:', error);
        return { success: false, error: 'Failed to update submission status.' };
    }
}
