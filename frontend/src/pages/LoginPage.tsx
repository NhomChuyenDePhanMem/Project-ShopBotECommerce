type LoginPageProps = {
  username: string;
  password: string;
  busy?: boolean;
  errorMessage?: string;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: () => void;
};

export function LoginPage(props: LoginPageProps) {
  const {
    username,
    password,
    busy,
    errorMessage,
    onUsernameChange,
    onPasswordChange,
    onSubmit,
  } = props;

  return (
    <main className="sb-login-bg relative min-h-dvh overflow-hidden">
      <div className="sb-login-orb sb-login-orb-a" aria-hidden />
      <div className="sb-login-orb sb-login-orb-b" aria-hidden />
      <div className="sb-login-grid" aria-hidden />

      <div className="mx-auto flex min-h-dvh max-w-5xl items-center px-4 py-10 sm:py-14">
        <section className="sb-login-card mx-auto w-full max-w-md">
          <p className="sb-login-pill">AI-Powered Ecommerce</p>
          <h1 className="sb-heading-page mt-3">ShopBot - Đăng nhập</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Chào mừng bạn quay lại. Đăng nhập để truy cập hệ thống theo đúng vai trò:
            customer, seller hoặc admin.
          </p>
          {errorMessage && (
            <p className="sb-alert-error mt-4" role="alert">
              {errorMessage}
            </p>
          )}
          <form
            className="mt-6 grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Tên đăng nhập
              <input
                className="sb-input"
                name="username"
                autoComplete="username"
                placeholder="vd. customer01"
                value={username}
                onChange={(e) => onUsernameChange(e.target.value)}
              />
            </label>
            <label className="grid gap-1.5 text-sm font-medium text-slate-700">
              Mật khẩu
              <input
                className="sb-input"
                name="password"
                type="password"
                autoComplete="current-password"
                placeholder="********"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
            </label>
            <button type="submit" className="sb-btn-primary w-full" disabled={busy}>
              Đăng nhập vào hệ thống
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

