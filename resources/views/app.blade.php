<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ config('app.name') }}</title>

        <title inertia>{{ config('app.name', 'ExamBits') }}</title>

        <link rel="icon" href="/frontend-laravel/public/ExamBitsLogo.svg" sizes="any">
        <link rel="icon" href="/frontend-laravel/public/ExamBitsLogo.svg" type="image/svg+xml">
        <link rel="icon" href="/frontend-laravel/public/favicon.ico" type="image/png">

        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@300,400,500,700&display=swap" rel="stylesheet">


        <link rel="preconnect" href="https://fonts.bunny.net">
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
