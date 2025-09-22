import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Circle, Clock } from 'lucide-react';

interface FollowUp {
    id: number;
    stage: string;
    attempt_1_completed: boolean;
    attempt_2_completed: boolean;
    attempt_3_completed: boolean;
    attempt_1_completed_at?: string;
    attempt_2_completed_at?: string;
    attempt_3_completed_at?: string;
    status: string;
    scheduled_at: string;
    leads: {
        id: number;
        nama_pelanggan: string;
        status: string;
    };
}

interface FollowUpTrackerProps {
    followUps: FollowUp[];
    stages: Record<string, string>;
    leadId: number;
}

export default function FollowUpTracker({ followUps, stages, leadId }: FollowUpTrackerProps) {
    const getStageFollowUps = (stage: string) => {
        return followUps.filter(fu => fu.stage === stage);
    };

    const renderAttemptBox = (completed: boolean, completedAt?: string) => {
        if (completed) {
            return (
                <div className="w-6 h-6 bg-green-100 border-2 border-green-500 rounded flex items-center justify-center" title={completedAt ? new Date(completedAt).toLocaleDateString('id-ID') : 'Completed'}>
                    <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
            );
        }
        return (
            <div className="w-6 h-6 bg-gray-100 border-2 border-gray-300 rounded flex items-center justify-center">
                <Circle className="w-4 h-4 text-gray-400" />
            </div>
        );
    };

    const getStageProgress = (stage: string) => {
        const stageFollowUps = getStageFollowUps(stage);
        if (stageFollowUps.length === 0) {
            return { 
                total: 0, 
                completed: 0, 
                hasResponse: false,
                attempts: [false, false, false],
                attemptDates: [null, null, null]
            };
        }

        // Each follow-up record represents one attempt for this stage
        // We need to show progress for up to 3 attempts total for the stage
        let attempts = [false, false, false];
        let attemptDates = [null, null, null];
        let hasResponse = false;

        // Sort follow-ups by attempt number to ensure correct order
        const sortedFollowUps = stageFollowUps.sort((a, b) => a.attempt - b.attempt);

        sortedFollowUps.forEach((followUp, index) => {
            // Each follow-up represents one attempt - mark it as completed if it has any completion
            if (index < 3) { // Only show up to 3 attempts
                const isCompleted = followUp.attempt_1_completed || followUp.attempt_2_completed || followUp.attempt_3_completed;
                attempts[index] = isCompleted;
                
                // Get the completion date from the completed attempt
                if (followUp.attempt_1_completed) {
                    attemptDates[index] = followUp.attempt_1_completed_at;
                } else if (followUp.attempt_2_completed) {
                    attemptDates[index] = followUp.attempt_2_completed_at;
                } else if (followUp.attempt_3_completed) {
                    attemptDates[index] = followUp.attempt_3_completed_at;
                }
            }
            
            if (followUp.status === 'completed') {
                hasResponse = true;
            }
        });

        const totalCompleted = attempts.filter(Boolean).length;

        return {
            total: 3,
            completed: totalCompleted,
            hasResponse,
            attempts,
            attemptDates
        };
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Progress Follow-up (Excel Format)
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b">
                                <th className="text-left py-2 px-4 font-medium">Tahap</th>
                                <th className="text-center py-2 px-2">1</th>
                                <th className="text-center py-2 px-2">2</th>
                                <th className="text-center py-2 px-2">3</th>
                                <th className="text-center py-2 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(stages).map(([stageKey, stageName]) => {
                                const stageFollowUps = getStageFollowUps(stageKey);
                                const latestFollowUp = stageFollowUps[stageFollowUps.length - 1];
                                const progress = getStageProgress(stageKey);

                                return (
                                    <tr key={stageKey} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4 font-medium">{stageName}</td>
                                        <td className="py-3 px-2 text-center">
                                            {renderAttemptBox(progress.attempts[0], progress.attemptDates[0] ?? undefined)}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            {renderAttemptBox(progress.attempts[1], progress.attemptDates[1] ?? undefined)}
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            {renderAttemptBox(progress.attempts[2], progress.attemptDates[2] ?? undefined)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {stageFollowUps.length > 0 ? (
                                                <Badge className={
                                                    progress.hasResponse ? 'bg-green-100 text-green-800' :
                                                    latestFollowUp?.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }>
                                                    {progress.hasResponse ? 'Berhasil' :
                                                     latestFollowUp?.status === 'scheduled' ? 'Terjadwal' :
                                                     'Tidak Ada Respon'}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-gray-100 text-gray-800">Belum Dimulai</Badge>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span>Follow-up Selesai</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Circle className="w-4 h-4 text-gray-400" />
                            <span>Belum Follow-up</span>
                        </div>
                    </div>
                    <p className="text-xs text-blue-800 mt-2">
                        <strong>Catatan:</strong> Setiap tahap maksimal 3x follow-up. Jika tidak ada respon setelah 3x, lead akan menjadi COLD.
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}