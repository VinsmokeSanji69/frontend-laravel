import jsPDF from 'jspdf';

type Question = {
    id: number;
    question: string;
    choices?: string[];
    answer: string;
};

type QuestionData = {
    multiple: Question[];
    trueOrFalse: Question[];
    identification: Question[];
};

type ExamData = {
    id: number;
    title: string;
    topic: string;
    difficulty: string;
    extracted_topic?: string;
};

type TestType = {
    name: string;
    instruction: string;
    questions: Question[];
    type: 'multiple' | 'trueOrFalse' | 'identification';
};

const numberToRoman = (num: number): string => {
    const romanMap: [string, number][] = [
        ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
        ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
        ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
    ];

    let result = '';
    let remaining = num;

    for (const [roman, value] of romanMap) {
        while (remaining >= value) {
            result += roman;
            remaining -= value;
        }
    }

    return result;
};

export const generateExamPdf = (exam: ExamData, questions: QuestionData) => {
    const pdf = new jsPDF('p', 'mm', 'letter');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPosition = margin;

    // Determine which test types to include
    const testTypes: TestType[] = [];

    if (questions.multiple.length > 0) {
        testTypes.push({
            name: 'MULTIPLE CHOICE',
            instruction: 'Choose the best answer and encircle the letter on the answer sheet.',
            questions: questions.multiple,
            type: 'multiple'
        });
    }

    if (questions.trueOrFalse.length > 0) {
        testTypes.push({
            name: 'TRUE OR FALSE',
            instruction: 'Write TRUE if the statement is correct and FALSE if it is not.',
            questions: questions.trueOrFalse,
            type: 'trueOrFalse'
        });
    }

    if (questions.identification.length > 0) {
        testTypes.push({
            name: 'IDENTIFICATION',
            instruction: 'Write the correct term, concept, or name being described.',
            questions: questions.identification,
            type: 'identification'
        });
    }

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
            return true;
        }
        return false;
    };

    // Helper function to draw wrapped text
    const drawWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 11) => {
        pdf.setFontSize(fontSize);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * (fontSize * 0.35); // Return height used
    };

    // ============ HEADER ============
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI-Powered Exam Generator', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 7;

    pdf.setFontSize(14);
    pdf.text(exam.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const topicInfo = `Topic: ${exam.extracted_topic} `;
    pdf.text(topicInfo, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;

    // Header border line
    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;

    // ============ STUDENT INFO ============
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'bold');

    const infoY = yPosition;
    const col1 = margin;
    const col2 = margin + (contentWidth / 3);
    const col3 = margin + (2 * contentWidth / 3);

    pdf.text('Name:', col1, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.line(col1 + 15, infoY + 1, col2 - 5, infoY + 1);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Date:', col2, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.line(col2 + 15, infoY + 1, col3 - 5, infoY + 1);

    pdf.setFont('helvetica', 'bold');
    pdf.text('Score:', col3, infoY);
    pdf.setFont('helvetica', 'normal');
    pdf.line(col3 + 15, infoY + 1, pageWidth - margin, infoY + 1);

    yPosition += 10;

    // ============ GENERAL INSTRUCTIONS ============
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, yPosition, contentWidth, 12, 'F');

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'bold');
    pdf.text('General Instructions: ', margin + 3, yPosition + 5);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Read each question carefully and answer each item with honesty.', margin + 45, yPosition + 5);
    yPosition += 18;

    // ============ TEST SECTIONS ============
    const letters = ['a', 'b', 'c', 'd', 'e', 'f'];

    testTypes.forEach((testType, testIndex) => {
        checkNewPage(20);

        // Test header
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        const testHeader = `TEST ${numberToRoman(testIndex + 1)} — ${testType.name}`;
        pdf.text(testHeader, margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 6;

        // Test instruction
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'italic');
        const instructionHeight = drawWrappedText(`Instructions: ${testType.instruction}`, margin, yPosition, contentWidth, 10);
        yPosition += instructionHeight + 5;

        // Questions
        testType.questions.forEach((question, qIndex) => {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(11);

            if (testType.type === 'multiple') {
                // Calculate space needed for this question
                const choicesCount = question.choices?.length || 0;
                const spaceNeeded = 8 + (choicesCount * 5);
                checkNewPage(spaceNeeded);

                // Question text
                const questionText = `${qIndex + 1}. ${question.question}`;
                const questionHeight = drawWrappedText(questionText, margin, yPosition, contentWidth, 11);
                yPosition += questionHeight + 3;

                // Choices
                if (question.choices) {
                    question.choices.forEach((choice, cIndex) => {
                        checkNewPage(5);
                        const choiceText = `   ${letters[cIndex]}. ${choice}`;
                        const choiceHeight = drawWrappedText(choiceText, margin, yPosition, contentWidth, 11);
                        yPosition += choiceHeight + 2;
                    });
                }
                yPosition += 3;

            } else if (testType.type === 'trueOrFalse' || testType.type === 'identification') {
                checkNewPage(10);

                const questionText = `${qIndex + 1}. ${question.question}`;
                const questionHeight = drawWrappedText(questionText, margin, yPosition, contentWidth, 11);
                yPosition += questionHeight + 5;
            }
        });

        yPosition += 5; // Space between test sections
    });

    // ============ FOOTER ON LAST PAGE OF EXAM ============
    const currentPage = pdf.internal.getNumberOfPages();
    pdf.setPage(currentPage);

    const footerY = pageHeight - 15;
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.setTextColor(100, 100, 100);
    pdf.text('~ This exam is generated by ExamBits ~', pageWidth / 2, footerY, { align: 'center' });
    pdf.setFont('helvetica', 'bold');
    pdf.text('Website: http://ExamBits.com', pageWidth / 2, footerY + 4, { align: 'center' });
    pdf.setTextColor(0, 0, 0);

    // ============ ANSWER KEY (NEW PAGE) ============
    pdf.addPage();
    yPosition = margin;

    // Answer Key Header
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('AI-Powered Exam Generator', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 7;

    pdf.setFontSize(14);
    pdf.text(exam.title, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 6;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(topicInfo, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 5;

    pdf.setLineWidth(0.5);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Answer Key Title
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(204, 0, 0);
    pdf.text('Answer Key:', pageWidth / 2, yPosition, { align: 'center' });
    pdf.setTextColor(0, 0, 0);
    yPosition += 10;

    // Answer Key Sections
    testTypes.forEach((testType, testIndex) => {
        checkNewPage(15);

        // Test header
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        const testHeader = `TEST ${numberToRoman(testIndex + 1)} — ${testType.name}`;
        pdf.text(testHeader, margin, yPosition);
        yPosition += 2;
        pdf.setLineWidth(0.3);
        pdf.line(margin, yPosition, pageWidth - margin, yPosition);
        yPosition += 8;

        // Answers
        testType.questions.forEach((question, qIndex) => {
            checkNewPage(7);

            pdf.setFontSize(11);
            pdf.setFont('helvetica', 'normal');

            let answerText = '';

            if (testType.type === 'multiple') {
                // For multiple choice, the answer is already stored as a letter (A, B, C, D)
                // We need to find the actual choice text based on the letter
                const answerLetter = question.answer.toUpperCase();
                const letterIndex = answerLetter.charCodeAt(0) - 65; // Convert A->0, B->1, C->2, D->3

                if (question.choices && letterIndex >= 0 && letterIndex < question.choices.length) {
                    const answerChoice = question.choices[letterIndex];
                    answerText = `${qIndex + 1}. ${answerLetter}. ${answerChoice}`;
                } else {
                    // Fallback if choices not available or index out of range
                    answerText = `${qIndex + 1}. ${answerLetter}`;
                }
            } else {
                // For true/false and identification, just show the answer
                answerText = `${qIndex + 1}. ${question.answer}`;
            }

            const answerHeight = drawWrappedText(answerText, margin + 5, yPosition, contentWidth - 5, 11);
            yPosition += answerHeight + 3;
        });

        yPosition += 5;
    });

    // Footer on answer key page
    const answerKeyPage = pdf.internal.getNumberOfPages();
    pdf.setPage(answerKeyPage);

    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'bold');
    pdf.setTextColor(100, 100, 100);
    pdf.text('Website: http://ExamBits.com', pageWidth / 2, pageHeight - 15, { align: 'center' });
    pdf.setTextColor(0, 0, 0);

    // Open PDF in new tab
    pdf.output('dataurlnewwindow');
};
