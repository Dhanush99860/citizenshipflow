"use client";

import { useEffect, useState } from "react";

type TOCItem = {
  id: string;
  title: string;
  depth: number; // 2 = h2, 3 = h3
};

export default function TableOfContents({
  toc,
  rootId = "article-scroll",
}: {
  toc: TOCItem[];
  rootId?: string;
}) {
  const [activeId, setActiveId] = useState<string>("");

  // Only keep H2 items
  const filteredTOC = toc.filter((item) => item.depth === 2);

  useEffect(() => {
    if (!filteredTOC || filteredTOC.length === 0) return;

    const root = document.getElementById(rootId) || undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target?.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        root,
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    );

    filteredTOC.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [filteredTOC, rootId]);

  if (!filteredTOC || filteredTOC.length === 0) return null;

  const handleClick = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    const root = document.getElementById(rootId);
    const el = document.getElementById(id);
    if (!root || !el) return;

    // Smooth scroll to heading
    const rootRect = root.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const offsetTop = elRect.top - rootRect.top + root.scrollTop;

    root.scrollTo({ top: offsetTop, behavior: "smooth" });
    window.history.replaceState(null, "", `#${id}`);

    // Add highlight effect on heading itself
    el.classList.add("bg-yellow-100", "transition", "duration-500", "rounded");
    setTimeout(() => {
      el.classList.remove("bg-yellow-100");
    }, 1500);
  };

  return (
    <div>
      <ul className="space-y-3 text-sm">
        {filteredTOC.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(item.id, e)}
              className={`block transition-colors duration-300 ${
                activeId === item.id
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600 hover:text-blue-500 dark:text-gray-300"
              }`}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
