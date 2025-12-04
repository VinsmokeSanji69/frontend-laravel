import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\API\AIController::uploadPdfAndGenerate
 * @see config/ai.php:22
 * @route '/api/ai/generate-from-pdf'
 */
export const uploadPdfAndGenerate = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadPdfAndGenerate.url(options),
    method: 'post',
})

uploadPdfAndGenerate.definition = {
    methods: ["post"],
    url: '/api/ai/generate-from-pdf',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AIController::uploadPdfAndGenerate
 * @see config/ai.php:22
 * @route '/api/ai/generate-from-pdf'
 */
uploadPdfAndGenerate.url = (options?: RouteQueryOptions) => {
    return uploadPdfAndGenerate.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AIController::uploadPdfAndGenerate
 * @see config/ai.php:22
 * @route '/api/ai/generate-from-pdf'
 */
uploadPdfAndGenerate.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: uploadPdfAndGenerate.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\API\AIController::uploadPdfAndGenerate
 * @see config/ai.php:22
 * @route '/api/ai/generate-from-pdf'
 */
    const uploadPdfAndGenerateForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: uploadPdfAndGenerate.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\API\AIController::uploadPdfAndGenerate
 * @see config/ai.php:22
 * @route '/api/ai/generate-from-pdf'
 */
        uploadPdfAndGenerateForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: uploadPdfAndGenerate.url(options),
            method: 'post',
        })
    
    uploadPdfAndGenerate.form = uploadPdfAndGenerateForm
/**
* @see \App\Http\Controllers\API\AIController::generateFromText
 * @see config/ai.php:113
 * @route '/api/ai/generate-from-text'
 */
export const generateFromText = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateFromText.url(options),
    method: 'post',
})

generateFromText.definition = {
    methods: ["post"],
    url: '/api/ai/generate-from-text',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AIController::generateFromText
 * @see config/ai.php:113
 * @route '/api/ai/generate-from-text'
 */
generateFromText.url = (options?: RouteQueryOptions) => {
    return generateFromText.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AIController::generateFromText
 * @see config/ai.php:113
 * @route '/api/ai/generate-from-text'
 */
generateFromText.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generateFromText.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\API\AIController::generateFromText
 * @see config/ai.php:113
 * @route '/api/ai/generate-from-text'
 */
    const generateFromTextForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generateFromText.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\API\AIController::generateFromText
 * @see config/ai.php:113
 * @route '/api/ai/generate-from-text'
 */
        generateFromTextForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generateFromText.url(options),
            method: 'post',
        })
    
    generateFromText.form = generateFromTextForm
/**
* @see \App\Http\Controllers\API\AIController::analyzeTopic
 * @see config/ai.php:222
 * @route '/api/ai/analyze-topic'
 */
export const analyzeTopic = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeTopic.url(options),
    method: 'post',
})

analyzeTopic.definition = {
    methods: ["post"],
    url: '/api/ai/analyze-topic',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AIController::analyzeTopic
 * @see config/ai.php:222
 * @route '/api/ai/analyze-topic'
 */
analyzeTopic.url = (options?: RouteQueryOptions) => {
    return analyzeTopic.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AIController::analyzeTopic
 * @see config/ai.php:222
 * @route '/api/ai/analyze-topic'
 */
analyzeTopic.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: analyzeTopic.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\API\AIController::analyzeTopic
 * @see config/ai.php:222
 * @route '/api/ai/analyze-topic'
 */
    const analyzeTopicForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: analyzeTopic.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\API\AIController::analyzeTopic
 * @see config/ai.php:222
 * @route '/api/ai/analyze-topic'
 */
        analyzeTopicForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: analyzeTopic.url(options),
            method: 'post',
        })
    
    analyzeTopic.form = analyzeTopicForm
/**
* @see \App\Http\Controllers\API\AIController::evaluateDifficulty
 * @see config/ai.php:172
 * @route '/api/ai/evaluate-difficulty'
 */
export const evaluateDifficulty = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: evaluateDifficulty.url(options),
    method: 'post',
})

evaluateDifficulty.definition = {
    methods: ["post"],
    url: '/api/ai/evaluate-difficulty',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AIController::evaluateDifficulty
 * @see config/ai.php:172
 * @route '/api/ai/evaluate-difficulty'
 */
evaluateDifficulty.url = (options?: RouteQueryOptions) => {
    return evaluateDifficulty.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AIController::evaluateDifficulty
 * @see config/ai.php:172
 * @route '/api/ai/evaluate-difficulty'
 */
evaluateDifficulty.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: evaluateDifficulty.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\API\AIController::evaluateDifficulty
 * @see config/ai.php:172
 * @route '/api/ai/evaluate-difficulty'
 */
    const evaluateDifficultyForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: evaluateDifficulty.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\API\AIController::evaluateDifficulty
 * @see config/ai.php:172
 * @route '/api/ai/evaluate-difficulty'
 */
        evaluateDifficultyForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: evaluateDifficulty.url(options),
            method: 'post',
        })
    
    evaluateDifficulty.form = evaluateDifficultyForm
/**
* @see \App\Http\Controllers\API\AIController::improveQuestion
 * @see config/ai.php:198
 * @route '/api/ai/improve-question'
 */
export const improveQuestion = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: improveQuestion.url(options),
    method: 'post',
})

improveQuestion.definition = {
    methods: ["post"],
    url: '/api/ai/improve-question',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\API\AIController::improveQuestion
 * @see config/ai.php:198
 * @route '/api/ai/improve-question'
 */
improveQuestion.url = (options?: RouteQueryOptions) => {
    return improveQuestion.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\API\AIController::improveQuestion
 * @see config/ai.php:198
 * @route '/api/ai/improve-question'
 */
improveQuestion.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: improveQuestion.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\API\AIController::improveQuestion
 * @see config/ai.php:198
 * @route '/api/ai/improve-question'
 */
    const improveQuestionForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: improveQuestion.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\API\AIController::improveQuestion
 * @see config/ai.php:198
 * @route '/api/ai/improve-question'
 */
        improveQuestionForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: improveQuestion.url(options),
            method: 'post',
        })
    
    improveQuestion.form = improveQuestionForm
const AIController = { uploadPdfAndGenerate, generateFromText, analyzeTopic, evaluateDifficulty, improveQuestion }

export default AIController