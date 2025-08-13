import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="min-h-[calc(100vh_-_10rem)] bg-gray-200">
        <ul>
          <li><Link href={"/admin"}>Admin page</Link></li>
          <li><Link href={"/menu"}>Menu page</Link></li>
          <li><Link href={"/cart"}>Cart page</Link></li>
          <li><Link href={"/test"}>Test page</Link></li>
        </ul>
      </div>
    </>
  );
}
