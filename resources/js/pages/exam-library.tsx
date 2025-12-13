import {router, usePage} from "@inertiajs/react";
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
interface User {
    id: number;
    name: string;
    email: string;
}
interface ExamLibraryProps {
    auth?: {
        user: User | null;
    };
    exams: ExamLibraryData[];
}

export default function ExamLibrary({ exams = [], auth }: ExamLibraryProps) {
    const handleExamClick = (examId: number) => {
        router.visit(`/exam-generator/view/${examId}`);
    };

    const handleBack = () => {
        router.visit('/');
    };

    // --- ADDED: Duplicate Handler ---
    const handleDuplicate = (examId: number) => {
        if (confirm("Are you sure you want to duplicate this exam?")) {
            router.post(`/exam-library/${examId}/duplicate`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    // Inertia automatically reloads the library list on success
                },
                onError: (errors) => {
                    console.error("Duplication failed:", errors);
                }
            });
        }
    };

    // --- ADDED: Delete Handler ---
    const handleDelete = (examId: number) => {
        if (confirm("Are you sure you want to permanently delete this exam?")) {
            router.delete(`/exam-library/${examId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    // Inertia automatically reloads the library list on success
                },
                onError: (errors) => {
                    console.error("Deletion failed:", errors);
                }
            });
        }
    };

    return (
        <AppLayout auth={auth}>
            <div className="flex flex-col min-h-[690px] lg:min-h-[695px] w-screen p-4 gap-6 pt-20">
                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row gap-4">
                        <Button variant="fit" size="xs" className="shadow-[4px_4px_0_#000000] transition-all hover:-translate-y-0.5" onClick={handleBack}>
                            <ArrowLeft />
                        </Button>

                        <div className="flex flex-row w-full justify-between">
                            <h1 className="text-2xl font-semibold">My Exam Library</h1>
                        </div>
                    </div>
                    <p className="text-sm text-foreground">
                        {exams.length} {exams.length === 1 ? 'exam' : 'exams'}
                    </p>
                </div>

                {exams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center min-h-[550px] gap-2">
                        <h2 className="text-xl font-semibold text-foreground">No exams yet</h2>
                        <p className="text-foreground">Create your first exam to get started!</p>
                    </div>
                ) : (
                    <div className="w-full gap-4 grid grid-cols-1 lg:grid-cols-3 sm:grid-cols-2">
                        {exams.map((exam, index) => (
                            <div
                                key={exam.id}
                                // Prevent card click event when interacting with buttons/dropdown
                                onClick={(e) => {
                                    // Check if the click originated from the dropdown/buttons
                                    if (e.target instanceof HTMLElement && e.target.closest('[data-action="card-action"]')) {
                                        e.stopPropagation();
                                        return;
                                    }
                                    handleExamClick(exam.id);
                                }}
                            >
                                <ExamCard
                                    data={{
                                        title: exam.title,
                                        questionCount: exam.question_count || 0,
                                        topic: exam.extracted_topic || exam.topic
                                    }}
                                    index={index}
                                    // Pass handlers with examId
                                    onDuplicate={() => handleDuplicate(exam.id)}
                                    onDelete={() => handleDelete(exam.id)}
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
