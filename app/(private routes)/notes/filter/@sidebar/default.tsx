import css from "./SidebarNotes.module.css";
const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];
import Link from "next/link";

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        <Link href="/notes/action/create">Create note</Link>
      </li>
      <li className={css.menuItem}>
        <Link href={`/notes/filter/all`} className={css.menuLink}>
          All notes
        </Link>
      </li>
      {tags.map((tag, index) => (
        <li className={css.menuItem} key={index}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
}
