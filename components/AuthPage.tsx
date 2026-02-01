
import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

interface AuthPageProps {
    onLogin: (user: any) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
    const [view, setView] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [token, setToken] = useState<string | null>(null);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
            setToken(urlToken);
            setView('reset');
            // Limpa a URL para não ficar com o token exposto após o carregamento
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (view === 'forgot') {
            try {
                const response = await fetch('http://localhost:5000/api/recuperar-senha', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.mensagem || 'Erro ao processar');

                setSuccessMessage(data.mensagem);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
            return;
        }

        if (view === 'reset') {
            if (password !== confirmPassword) {
                setError('As senhas não conferem.');
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/redefinir-senha', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, novaSenha: password })
                });
                const data = await response.json();
                if (!response.ok) throw new Error(data.mensagem || 'Erro ao processar');

                setSuccessMessage(data.mensagem + " Você será redirecionado para o login...");
                setTimeout(() => {
                    setView('login');
                    setSuccessMessage('');
                    setPassword('');
                    setConfirmPassword('');
                }, 3000);
                setLoading(false);
            } catch (err: any) {
                setError(err.message);
                setLoading(false);
            }
            return;
        }

        const endpoint = view === 'login' ? '/api/login' : '/api/usuarios';
        const payload = view === 'login'
            ? { email, senha: password }
            : { nome: name, email, senha: password };

        try {
            const response = await fetch(`http://localhost:5000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.mensagem || 'Erro ao processar solicitação');
            }

            // Se deu certo, chamamos o onLogin do App.tsx
            setTimeout(() => {
                onLogin(data.user);
                setLoading(false);
            }, 1000);

        } catch (err: any) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-[#030712] overflow-hidden">
            {/* Left Side: Visual / Branding (Desktop only) */}
            <div className="hidden lg:flex lg:w-3/5 xl:w-[65%] relative overflow-hidden bg-slate-900 border-r border-slate-800/50">
                <img
                    src="/images/auth-bg.jpg"
                    alt="e-Xpress Hub"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#030712] via-transparent to-[#030712]/40"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-transparent to-transparent"></div>

                <div className="absolute bottom-12 left-12 z-20">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-2xl shadow-blue-500/40 transform -rotate-3">e</div>
                        <h1 className="text-6xl font-black text-white tracking-tighter">e-Xpress</h1>
                    </div>
                    <p className="text-2xl font-bold text-slate-300 max-w-xl leading-snug">
                        A nova fronteira da <span className="text-blue-500">Logística Industrial</span> e <span className="text-cyan-500">Gestão de Marketplace</span> unificados.
                    </p>
                    <div className="flex gap-4 mt-8">
                        <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Server Active</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 flex items-center gap-2">
                            <ShieldCheck size={14} className="text-blue-500" />
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">AES-256 Encryption</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-2/5 xl:w-[35%] flex flex-col justify-center p-8 md:p-16 xl:p-24 relative z-10 bg-[#030712]">
                <div className="lg:hidden mb-12 flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl">e</div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">e-Xpress</h1>
                </div>

                <div className="mb-10">
                    <h2 className="text-3xl font-black text-white tracking-tight mb-3">
                        {view === 'login' ? 'Bem-vindo de volta' : view === 'register' ? 'Crie sua conta' : view === 'reset' ? 'Nova Senha' : 'Recuperar Acesso'}
                    </h2>
                    <p className="text-slate-500 font-medium">
                        {view === 'forgot' ? 'Informe seu e-mail para receber as instruções.' : view === 'reset' ? 'Defina sua nova credencial de acesso.' : 'Acesse a central de comando do seu ecossistema.'}
                    </p>
                </div>

                {view !== 'forgot' && view !== 'reset' && (
                    <div className="flex mb-8 p-1.5 bg-slate-900 rounded-2xl border border-slate-800">
                        <button
                            onClick={() => { setView('login'); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${view === 'login' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <LogIn size={18} />
                            Acessar
                        </button>
                        <button
                            onClick={() => { setView('register'); setError(''); setSuccessMessage(''); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${view === 'register' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            <UserPlus size={18} />
                            Registrar
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-shake">
                        <AlertCircle size={18} className="shrink-0" />
                        <span className="font-semibold">{error}</span>
                    </div>
                )}

                {successMessage && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-3 text-green-400 text-sm">
                        <ShieldCheck size={18} className="shrink-0" />
                        <span className="font-semibold">{successMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {view === 'register' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[0.2em]">Nome Completo</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    required={view === 'register'}
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {view !== 'forgot' && view !== 'reset' && (
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[0.2em]">Identificação Digital</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                />
                            </div>
                        </div>
                    )}

                    {view !== 'forgot' && (
                        <>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center ml-1">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                        {view === 'reset' ? 'Nova Senha' : 'Código de Acesso'}
                                    </label>
                                    {view === 'login' && (
                                        <button
                                            type="button"
                                            onClick={() => { setView('forgot'); setError(''); setSuccessMessage(''); }}
                                            className="text-[10px] font-bold text-blue-500 hover:underline"
                                        >
                                            Esqueceu a senha?
                                        </button>
                                    )}
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                    />
                                </div>
                            </div>

                            {view === 'reset' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-500 ml-1 uppercase tracking-[0.2em]">Confirmar Nova Senha</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                        <input
                                            type="password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-12 py-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl shadow-2xl shadow-blue-500/20 transform active:scale-[0.98] transition-all flex items-center justify-center gap-3 mt-8 disabled:opacity-70 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                    >
                        {loading ? (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Verificando...</span>
                            </div>
                        ) : (
                            <>
                                <span>
                                    {view === 'login' ? 'Entrar no Sistema' : view === 'register' ? 'Criar minha conta' : view === 'reset' ? 'Salvar Nova Senha' : 'Enviar Link'}
                                </span>
                                <ArrowRight size={20} />
                            </>
                        )}
                    </button>

                    {view === 'forgot' && (
                        <button
                            type="button"
                            onClick={() => { setView('login'); setError(''); setSuccessMessage(''); }}
                            className="w-full text-center text-slate-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors mt-4"
                        >
                            Voltar para o login
                        </button>
                    )}
                </form>

                <div className="mt-auto pt-16 flex flex-col items-center gap-6">
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em]">Ambiente Seguro & Monitorado</p>
                    <div className="flex gap-8 opacity-30 grayscale hover:grayscale-0 transition-all">
                        {/* Fake security badges */}
                        <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                        <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                        <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 0s 2;
        }
      `}</style>
        </div>
    );
};

export default AuthPage;