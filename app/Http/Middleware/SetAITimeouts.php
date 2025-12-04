<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetAITimeouts
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Set longer execution time for AI routes
        if ($request->is('api/ai/*') || $request->is('exam-generator/generate')) {
            set_time_limit(config('ai.execution_time_limit', 180));
            ini_set('max_execution_time', config('ai.execution_time_limit', 180));
        }

        return $next($request);
    }
}
