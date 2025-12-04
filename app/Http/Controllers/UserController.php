<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    //
    public function login(): \Inertia\Response
    {
        return Inertia::render('log-in', []);
    }
    public function signup(): \Inertia\Response
    {
        return Inertia::render('sign-up', []);
    }
}
