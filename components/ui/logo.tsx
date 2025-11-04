import Image from "next/image";

export function Logo() {
  return (
    <div className="flex w-full justify-center items-center gap-2 mb-4">
      <Image src="/logos/logo.svg" alt="Workflow" width={40} height={40} />
      <h1 className="text-2xl font-bold text-black dark:text-zinc-50">
        Nodebase
      </h1>
    </div>
  );
}
