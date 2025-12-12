import {Button} from "@/components/ui/button";
import InputError from "@/components/input-error";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {FormEvent} from "react";
import {useForm} from "@inertiajs/react";

export default function LogIn() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="flex flex-col h-screen w-screen py-6">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md h-fit bg-background px-8">
                <form onSubmit={handleSubmit}>
                    <div className="text-center justify-center gap-4 leading-none mb-10">
                        <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="justify-center w-full mb-4">
                            <rect x="1" y="1" width="54" height="54" rx="27" stroke="black" strokeWidth="2"/>
                            <path d="M18.8334 31.6665C15.7958 31.6665 13.3334 34.1289 13.3334 37.1665C13.3334 40.2041 15.7958 42.6665 18.8334 42.6665C19.4762 42.6665 20.0933 42.5562 20.6667 42.3535" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M13.8167 34.6087C11.3607 33.4236 9.66627 30.9098 9.66627 28.0002C9.66627 25.7789 10.654 23.7882 12.2141 22.4434" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M12.2705 22.2949C11.7835 21.5668 11.4995 20.6915 11.4995 19.7498C11.4995 17.2185 13.5516 15.1665 16.0829 15.1665C17.1149 15.1665 18.0672 15.5076 18.8333 16.0832" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M19.2691 16.2029C18.9896 15.6104 18.8333 14.9484 18.8333 14.2498C18.8333 11.7185 20.8854 9.6665 23.4167 9.6665C25.948 9.6665 28 11.7185 28 14.2498V42.6665" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M20.6667 42.6665C20.6667 44.6915 22.3083 46.3332 24.3333 46.3332C26.3584 46.3332 28 44.6915 28 42.6665" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M28.0001 18.8335C28.0001 21.8711 30.4625 24.3335 33.5001 24.3335" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M43.7839 22.4434C45.344 23.7882 46.3317 25.7789 46.3317 28.0002C46.3317 29.2892 45.9992 30.5006 45.4151 31.5531" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M43.7291 22.2949C44.2161 21.5668 44.5 20.6915 44.5 19.7498C44.5 17.2185 42.448 15.1665 39.9167 15.1665C38.8847 15.1665 37.9324 15.5076 37.1663 16.0832" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M28.0001 14.2498C28.0001 11.7185 30.0521 9.6665 32.5834 9.6665C35.1147 9.6665 37.1667 11.7185 37.1667 14.2498C37.1667 14.9484 37.0105 15.6104 36.731 16.2029" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M31.6667 46.3332C29.6417 46.3332 28.0001 44.6915 28.0001 42.6665" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M40.2222 35.3335L37.1667 40.8335H44.5L41.4445 46.3335" stroke="#131927" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <h1 className="text-xl font-semibold mb-2">Welcome back</h1>
                        <p className="text-sm font-regular">Enter your credentials to access your account</p>
                    </div>
                    <div className="grid gap-4 bg-background">
                        <div className="grid gap-2 bg-background">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder="email@example.com"
                                className="bg-background"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="w-4 h-4 border-2 border-foreground rounded"
                            />
                            <Label htmlFor="remember" className="cursor-pointer">Remember me</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-6 w-full rounded-md"
                            variant="outline"
                            size="lg"
                            tabIndex={3}
                            disabled={processing}
                        >
                            Log in
                        </Button>

                        <div className="flex flex-row items-center justify-center space-x-1">
                            <p>Don't have an account?</p>
                            <a href="/signup" className="font-semibold hover:underline">Sign up</a>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
