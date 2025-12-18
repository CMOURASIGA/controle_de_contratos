import Link from "next/link";

interface BreadcrumbItem {
  title: string;
  link?: string; // opcional, caso seja o último item (sem link)
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center">
              {item.link && !isLast ? (
                <Link
                  href={item.link}
                  className="hover:text-blue-600 transition-colors"
                >
                  {item.title}
                </Link>
              ) : (
                <span className="text-gray-700 font-medium">{item.title}</span>
              )}
              {!isLast && <span className="mx-2">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
