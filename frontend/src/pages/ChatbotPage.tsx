type ChatbotPageProps = {
  input: string;
  output: string;
  busy?: boolean;
  onInputChange: (value: string) => void;
  onSend: () => void;
};

export function ChatbotPage(props: ChatbotPageProps) {
  const { input, output, busy, onInputChange, onSend } = props;

  return (
    <section className="sb-card sb-card-pad">
      <h2 className="sb-heading-section mb-2">Chatbot AI</h2>
      <p className="mb-4 text-sm text-slate-600">
        Hỏi tư vấn sản phẩm theo nhu cầu, ngân sách và mục đích sử dụng.
      </p>
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          onSend();
        }}
      >
        <input
          className="sb-input min-h-11 flex-1"
          placeholder="Ví dụ: laptop cho sinh viên dưới 20 triệu"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
        />
        <button type="submit" className="sb-btn-primary w-full sm:w-auto" disabled={busy}>
          Gửi
        </button>
      </form>
      {output && (
        <pre className="mt-4 max-h-[min(50vh,24rem)] overflow-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-800">
          {output}
        </pre>
      )}
    </section>
  );
}

