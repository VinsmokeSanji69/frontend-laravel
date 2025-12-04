import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
const index980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

index980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return index980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
index980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
    const index980bb49ee7ae63891f1d891d2fbcf1c9Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
        index980bb49ee7ae63891f1d891d2fbcf1c9Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/'
 */
        index980bb49ee7ae63891f1d891d2fbcf1c9Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index980bb49ee7ae63891f1d891d2fbcf1c9.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index980bb49ee7ae63891f1d891d2fbcf1c9.form = index980bb49ee7ae63891f1d891d2fbcf1c9Form
    /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
const index6baac021d6feda071f12a75cda21e3e4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6baac021d6feda071f12a75cda21e3e4.url(options),
    method: 'get',
})

index6baac021d6feda071f12a75cda21e3e4.definition = {
    methods: ["get","head"],
    url: '/exam-generator',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
index6baac021d6feda071f12a75cda21e3e4.url = (options?: RouteQueryOptions) => {
    return index6baac021d6feda071f12a75cda21e3e4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
index6baac021d6feda071f12a75cda21e3e4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index6baac021d6feda071f12a75cda21e3e4.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
index6baac021d6feda071f12a75cda21e3e4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index6baac021d6feda071f12a75cda21e3e4.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
    const index6baac021d6feda071f12a75cda21e3e4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: index6baac021d6feda071f12a75cda21e3e4.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
        index6baac021d6feda071f12a75cda21e3e4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6baac021d6feda071f12a75cda21e3e4.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExamController::index
 * @see app/Http/Controllers/ExamController.php:25
 * @route '/exam-generator'
 */
        index6baac021d6feda071f12a75cda21e3e4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: index6baac021d6feda071f12a75cda21e3e4.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    index6baac021d6feda071f12a75cda21e3e4.form = index6baac021d6feda071f12a75cda21e3e4Form

export const index = {
    '/': index980bb49ee7ae63891f1d891d2fbcf1c9,
    '/exam-generator': index6baac021d6feda071f12a75cda21e3e4,
}

/**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
const generate99edf3a16904074f1533a5ca97d58055 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generate99edf3a16904074f1533a5ca97d58055.url(options),
    method: 'get',
})

generate99edf3a16904074f1533a5ca97d58055.definition = {
    methods: ["get","head"],
    url: '/exam-generator/generate',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
generate99edf3a16904074f1533a5ca97d58055.url = (options?: RouteQueryOptions) => {
    return generate99edf3a16904074f1533a5ca97d58055.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
generate99edf3a16904074f1533a5ca97d58055.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generate99edf3a16904074f1533a5ca97d58055.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
generate99edf3a16904074f1533a5ca97d58055.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generate99edf3a16904074f1533a5ca97d58055.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
    const generate99edf3a16904074f1533a5ca97d58055Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generate99edf3a16904074f1533a5ca97d58055.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
        generate99edf3a16904074f1533a5ca97d58055Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generate99edf3a16904074f1533a5ca97d58055.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
        generate99edf3a16904074f1533a5ca97d58055Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generate99edf3a16904074f1533a5ca97d58055.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generate99edf3a16904074f1533a5ca97d58055.form = generate99edf3a16904074f1533a5ca97d58055Form
    /**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
const generate99edf3a16904074f1533a5ca97d58055 = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate99edf3a16904074f1533a5ca97d58055.url(options),
    method: 'post',
})

generate99edf3a16904074f1533a5ca97d58055.definition = {
    methods: ["post"],
    url: '/exam-generator/generate',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
generate99edf3a16904074f1533a5ca97d58055.url = (options?: RouteQueryOptions) => {
    return generate99edf3a16904074f1533a5ca97d58055.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
generate99edf3a16904074f1533a5ca97d58055.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: generate99edf3a16904074f1533a5ca97d58055.url(options),
    method: 'post',
})

    /**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
    const generate99edf3a16904074f1533a5ca97d58055Form = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: generate99edf3a16904074f1533a5ca97d58055.url(options),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ExamController::generate
 * @see app/Http/Controllers/ExamController.php:34
 * @route '/exam-generator/generate'
 */
        generate99edf3a16904074f1533a5ca97d58055Form.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: generate99edf3a16904074f1533a5ca97d58055.url(options),
            method: 'post',
        })
    
    generate99edf3a16904074f1533a5ca97d58055.form = generate99edf3a16904074f1533a5ca97d58055Form

export const generate = {
    '/exam-generator/generate': generate99edf3a16904074f1533a5ca97d58055,
    '/exam-generator/generate': generate99edf3a16904074f1533a5ca97d58055,
}

/**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
export const generating = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generating.url(options),
    method: 'get',
})

generating.definition = {
    methods: ["get","head"],
    url: '/exam-generator/generating',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
generating.url = (options?: RouteQueryOptions) => {
    return generating.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
generating.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: generating.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
generating.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: generating.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
    const generatingForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: generating.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
        generatingForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generating.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExamController::generating
 * @see app/Http/Controllers/ExamController.php:182
 * @route '/exam-generator/generating'
 */
        generatingForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: generating.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    generating.form = generatingForm
/**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
export const exportMethod = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})

exportMethod.definition = {
    methods: ["get","head"],
    url: '/exam-generator/export/{examId}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
exportMethod.url = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return exportMethod.definition.url
            .replace('{examId}', parsedArgs.examId.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
exportMethod.get = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: exportMethod.url(args, options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
exportMethod.head = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: exportMethod.url(args, options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
    const exportMethodForm = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: exportMethod.url(args, options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
        exportMethodForm.get = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\ExamController::exportMethod
 * @see app/Http/Controllers/ExamController.php:243
 * @route '/exam-generator/export/{examId}'
 */
        exportMethodForm.head = (args: { examId: string | number } | [examId: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: exportMethod.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    exportMethod.form = exportMethodForm
/**
* @see \App\Http\Controllers\ExamController::updateTitle
 * @see app/Http/Controllers/ExamController.php:233
 * @route '/exam/{id}/update-title'
 */
export const updateTitle = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTitle.url(args, options),
    method: 'patch',
})

updateTitle.definition = {
    methods: ["patch"],
    url: '/exam/{id}/update-title',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\ExamController::updateTitle
 * @see app/Http/Controllers/ExamController.php:233
 * @route '/exam/{id}/update-title'
 */
updateTitle.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    
    if (Array.isArray(args)) {
        args = {
                    id: args[0],
                }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
                        id: args.id,
                }

    return updateTitle.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\ExamController::updateTitle
 * @see app/Http/Controllers/ExamController.php:233
 * @route '/exam/{id}/update-title'
 */
updateTitle.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: updateTitle.url(args, options),
    method: 'patch',
})

    /**
* @see \App\Http\Controllers\ExamController::updateTitle
 * @see app/Http/Controllers/ExamController.php:233
 * @route '/exam/{id}/update-title'
 */
    const updateTitleForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
        action: updateTitle.url(args, {
                    [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                        _method: 'PATCH',
                        ...(options?.query ?? options?.mergeQuery ?? {}),
                    }
                }),
        method: 'post',
    })

            /**
* @see \App\Http\Controllers\ExamController::updateTitle
 * @see app/Http/Controllers/ExamController.php:233
 * @route '/exam/{id}/update-title'
 */
        updateTitleForm.patch = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
            action: updateTitle.url(args, {
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'PATCH',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'post',
        })
    
    updateTitle.form = updateTitleForm
const ExamController = { index, generate, generating, exportMethod, updateTitle, export: exportMethod }

export default ExamController