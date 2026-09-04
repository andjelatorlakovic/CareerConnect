interface ErrorMessageProps {
  message: string;
}

export default function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <div
      style={{
        background: '#ffe5e5',
        color: '#c62828',
        padding: '10px 12px',
        borderRadius: 8,
        marginBottom: 15,
        fontSize: 14,
      }}
    >
      {message}
    </div>
  );
}