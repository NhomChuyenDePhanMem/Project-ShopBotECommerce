import type { Role, User } from '../services/authService';

type AdminUsersPageProps = {
  users: User[];
  roles: Role[];
  form: { username: string; password: string; fullName: string; roleId: string };
  busy?: boolean;
  onFormChange: (key: 'username' | 'password' | 'fullName' | 'roleId', value: string) => void;
  onCreateUser: () => void;
  onDeleteUser: (id: number) => void;
};

export function AdminUsersPage(props: AdminUsersPageProps) {
  const { users, roles, form, busy, onFormChange, onCreateUser, onDeleteUser } = props;

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="sb-card sb-card-pad lg:col-span-2">
        <h2 className="sb-heading-section mb-3">Hướng dẫn quyền quản trị</h2>
        <ul className="list-disc space-y-1 pl-5 text-sm text-slate-700">
          <li>
            <span className="font-medium">Admin hệ thống:</span> quản lý tài khoản, phân vai trò, theo dõi
            toàn bộ đơn hàng.
          </li>
          <li>
            <span className="font-medium">Seller:</span> xử lý đơn hàng (xác nhận, giao hàng), không được quản trị
            tài khoản hệ thống.
          </li>
          <li>
            <span className="font-medium">Customer:</span> mua hàng, quản lý giỏ, theo dõi đơn của chính mình.
          </li>
        </ul>
        <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Lưu ý: thao tác xóa tài khoản là thao tác nhạy cảm. Chỉ xóa khi đã xác minh với nhóm quản trị.
        </p>
      </article>

      <article className="sb-card sb-card-pad">
        <h2 className="sb-heading-section mb-4">Quản trị user</h2>
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            onCreateUser();
          }}
        >
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Tên đăng nhập
            <input
              className="sb-input"
              placeholder="vd: nhanvien01"
              value={form.username}
              onChange={(e) => onFormChange('username', e.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Mật khẩu tạm thời
            <input
              className="sb-input"
              type="password"
              placeholder="Tối thiểu 6 ký tự"
              value={form.password}
              onChange={(e) => onFormChange('password', e.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Họ và tên
            <input
              className="sb-input"
              placeholder="Nguyen Van A"
              value={form.fullName}
              onChange={(e) => onFormChange('fullName', e.target.value)}
            />
          </label>
          <label className="grid gap-1.5 text-sm font-medium text-slate-700">
            Chọn vai trò
            <select
              className="sb-select"
              value={form.roleId}
              onChange={(e) => onFormChange('roleId', e.target.value)}
            >
              <option value="">Chọn role</option>
              {roles.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="sb-btn-primary w-full sm:w-auto" disabled={busy}>
            Tạo tài khoản mới
          </button>
        </form>
      </article>

      <article className="sb-card sb-card-pad">
        <h2 className="sb-heading-section mb-4">Danh sách tài khoản</h2>
        <ul className="space-y-2">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 text-sm"
            >
              <span>
                <span className="font-medium">{u.fullName}</span>{' '}
                <span className="text-slate-500">({u.username}) - {u.role ?? 'n/a'}</span>
              </span>
              <button
                type="button"
                className="sb-btn-danger sb-btn-sm"
                onClick={() => onDeleteUser(u.id)}
                disabled={busy}
              >
                Xóa
              </button>
            </li>
          ))}
        </ul>
      </article>
    </section>
  );
}

