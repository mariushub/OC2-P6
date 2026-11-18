import LogoIcon from "./LogoIcon";

export default function Footer() {
  return (
    <footer className="flex items-center justify-between bg-white px-[100px] py-2.5 text-body">
      <p className="flex gap-[9px]">
        <span>©Sportsee</span>
        <span>Tous droits réservés</span>
      </p>
      <div className="flex items-center gap-4">
        <span>Conditions générales</span>
        <span>Contact</span>
        <LogoIcon />
      </div>
    </footer>
  );
}
