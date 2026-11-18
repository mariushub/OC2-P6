import logoText from "../assets/logo-text.svg";
import LogoIcon from "./LogoIcon";

// Logo complet : icône animée + texte "SPORTSEE"
export default function Logo() {
  return (
    <span role="img" aria-label="SportSee" className="flex w-fit items-center gap-[5px]">
      <LogoIcon />
      <img src={logoText} alt="" className="h-6 w-[133px]" />
    </span>
  );
}
