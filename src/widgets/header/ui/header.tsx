export const Header = () => {
  const today = new Date().toDateString();
  return (
    <header className="p-4 font-bold">
      <h1>{today}</h1>
    </header>
  );
};
