import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
export const generatePdf = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatePdf.url(args, options),
    method: 'get',
})

generatePdf.definition = {
    methods: ["get","head"],
    url: '/exam-generator/publish/{examId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
generatePdf.url = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { examId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    examId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        examId: args.examId,
                }

    return generatePdf.definition.url
            .replace('{examId}', parsedArgs.examId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
generatePdf.get = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generatePdf.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
generatePdf.head = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generatePdf.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
    const generatePdfForm = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generatePdf.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
        generatePdfForm.get = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatePdf.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublishController::generatePdf
 * @see app/Http/Controllers/PublishController.php:10
 * @route '/exam-generator/publish/{examId}'
 */
        generatePdfForm.head = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generatePdf.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generatePdf.form = generatePdfForm
/**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
export const generateAnswerKey = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateAnswerKey.url(args, options),
    method: 'get',
})

generateAnswerKey.definition = {
    methods: ["get","head"],
    url: '/exam-generator/answer-key/{examId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
generateAnswerKey.url = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { examId: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    examId: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        examId: args.examId,
                }

    return generateAnswerKey.definition.url
            .replace('{examId}', parsedArgs.examId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
generateAnswerKey.get = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generateAnswerKey.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
generateAnswerKey.head = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generateAnswerKey.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
    const generateAnswerKeyForm = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generateAnswerKey.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
        generateAnswerKeyForm.get = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generateAnswerKey.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\PublishController::generateAnswerKey
 * @see app/Http/Controllers/PublishController.php:85
 * @route '/exam-generator/answer-key/{examId}'
 */
        generateAnswerKeyForm.head = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generateAnswerKey.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generateAnswerKey.form = generateAnswerKeyForm
const PublishController = { generatePdf, generateAnswerKey }

export default PublishController