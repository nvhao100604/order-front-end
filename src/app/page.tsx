import Link from "next/link";

export default function Home() {
  return (
    <>
      <div>
        <ul>
          <li><Link href={"/admin"}>Admin page</Link></li>
          <li><Link href={"/menu"}>Menu page</Link></li>
        </ul>
      </div>
    </>
  );
}
