import { router } from "@inertiajs/react";
import AppLayout from "@/layouts/app-layout";
import { AppFooter } from "@/components/app-footer";
import { ExamCard } from "@/components/ui/exam-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type ExamLibraryData = {
    id: number;
    title: string;
    topic: string;
    extracted_topic?: string;
    question_count?: number;
    created_at: string;
};

interface ExamLibraryProps {
    exams: ExamLibraryData[];
}

export default function ExamLibrary({ exams = [] }: ExamLibraryProps) {
    const handleExamClick = (examId: number) => {
        // Use the correct route from your web.php: /exam-generator/view/{id}
        router.visit(`/exam-generator/view/${examId}`);
    };

    const handleBack = () => {
        router.visit('/');
    };

    return (
        <AppLayout>
            <div className="flex flex-col min-h-screen lg:min-h-[700px] w-screen p-6 gap-3 pt-20">
                <div className="flex flex-row w-full justify-between items-center">
                    <Button variant="fit" size="xs" onClick={handleBack}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Home
                    </Button>
                    <h1 className="text-xl font-semibold">My Exambits</h1>
                    <p className="text-sm text-gray-600">
                        {exams.length} {exams.length === 1 ? 'exam' : 'exams'}
                    </p>
                </div>

                {exams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-4">
                        <div className="text-6xl">📚</div>
                        <h2 className="text-xl font-semibold text-gray-700">No exams yet</h2>
                        <p className="text-gray-500">Create your first exam to get started!</p>
                    </div>
                ) : (
                    <div className="w-full gap-4 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2">
                        {exams.map((exam, index) => (
                            <div
                                key={exam.id}
                                onClick={() => handleExamClick(exam.id)}
                                className="cursor-pointer transition-transform hover:scale-105"
                            >
                                <ExamCard
                                    data={{
                                        title: exam.title,
                                        questionCount: exam.question_count || 0,
                                        topic: exam.extracted_topic || exam.topic
                                    }}
                                    index={index}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <AppFooter />
        </AppLayout>
    );
}
