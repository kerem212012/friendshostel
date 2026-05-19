import Link from "next/link";
import {notFound} from "next/navigation";
import {getPageByUrl} from "@/app/page/service";
import {BlocksContent} from "@strapi/blocks-react-renderer";

interface PageParams {
  params: Promise<{
    id: string;
  }>;
}

function renderInline(child: any, key: number) {
  if (child.type === "text") {
    let text = child.text;

    if (child.bold) {
      text = <strong className="font-semibold">{text}</strong>;
    }

    if (child.italic) {
      text = <em className="italic">{text}</em>;
    }

    if (child.underline) {
      text = <span className="underline">{text}</span>;
    }

    if (child.code) {
      text = (
          <code className="px-1 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-sm">
            {text}
          </code>
      );
    }

    return <span key={key}>{text}</span>;
  }

  if (child.type === "link") {
    return (
        <Link
            key={key}
            href={child.url}
            className="text-blue-600 dark:text-blue-400 underline hover:no-underline"
        >
          {child.children?.map((nested: any, i: number) =>
              renderInline(nested, i)
          )}
        </Link>
    );
  }

  return null;
}

function renderPageBody(body: BlocksContent) {
  return body.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
            <p
                key={index}
                className="mb-4 leading-7 text-zinc-700 dark:text-zinc-300"
            >
              {block.children?.map((child, i) => renderInline(child, i))}
            </p>
        );

      case "heading":
        return (
            <h2
                key={index}
                className="mt-8 mb-4 text-2xl font-bold text-black dark:text-white"
            >
              {block.children?.map((child, i) => renderInline(child, i))}
            </h2>
        );

      case "quote":
        return (
            <blockquote
                key={index}
                className="border-l-4 border-zinc-300 dark:border-zinc-700 pl-4 italic my-6 text-zinc-600 dark:text-zinc-400"
            >
              {block.children?.map((child, i) => renderInline(child, i))}
            </blockquote>
        );

      case "list":
        const ListTag = block.format === "ordered" ? "ol" : "ul";
        return (
            <ListTag
                key={index}
                className="mb-6 ml-6 list-disc text-zinc-700 dark:text-zinc-300"
            >
              {block.children?.map((item: any, i: number) => (
                  <li key={i}>
                    {item.children?.map((child: any, j: number) =>
                        renderInline(child, j)
                    )}
                  </li>
              ))}
            </ListTag>
        );

      default:
        return null;
    }
  });
}


export default async function Page({ params }: PageParams) {
  const { id } = await params;

  const page = await getPageByUrl(id);

  // If page not found, show 404
  if (!page) {
    notFound();
  }

  return (
      <div className="min-h-screen bg-white dark:bg-black py-8">
        <main className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">
            {page.Title}
          </h1>

          <div className="mb-8 prose prose-lg dark:prose-invert max-w-none">
            {page.Body && renderPageBody(page.Body)}
          </div>

          <div className="mt-8">
            <Link
                href="/"
                className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              &larr; Back to home
            </Link>
          </div>
        </main>
      </div>
  );
}