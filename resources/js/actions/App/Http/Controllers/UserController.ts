import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})

login.definition = {
    methods: ["get","head"],
    url: '/exam-generator/login',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: login.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: login.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
    const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: login.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
        loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::login
 * @see app/Http/Controllers/UserController.php:13
 * @route '/exam-generator/login'
 */
        loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: login.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    login.form = loginForm
/**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
export const signup = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signup.url(options),
    method: 'get',
})

signup.definition = {
    methods: ["get","head"],
    url: '/exam-generator/signup',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
signup.url = (options?: RouteQueryOptions) => {
    return signup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
signup.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: signup.url(options),
    method: 'get',
})
/**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
signup.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: signup.url(options),
    method: 'head',
})

    /**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
    const signupForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
        action: signup.url(options),
        method: 'get',
    })

            /**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
        signupForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: signup.url(options),
            method: 'get',
        })
            /**
* @see \App\Http\Controllers\UserController::signup
 * @see app/Http/Controllers/UserController.php:17
 * @route '/exam-generator/signup'
 */
        signupForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
            action: signup.url({
                        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
                            _method: 'HEAD',
                            ...(options?.query ?? options?.mergeQuery ?? {}),
                        }
                    }),
            method: 'get',
        })
    
    signup.form = signupForm
const UserController = { login, signup }

export default UserController