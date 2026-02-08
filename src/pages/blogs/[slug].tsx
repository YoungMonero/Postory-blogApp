import { GetServerSideProps } from "next";
import { getPublicBlogBySlug } from "@/src/services/blogs";

type Blog = {
  title: string;
  content: string;
  createdAt: string;
  tags?: string[];
};

type Props = {
  blog: Blog;
};

export default function BlogPage({ blog }: Props) {
  return (
    <main style={{ maxWidth: 800, margin: "60px auto", padding: "0 20px" }}>
      {/* Title */}
      <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", marginBottom: 10 }}>
        {blog.title}
      </h1>

      {/* Date */}
      <p style={{ color: "#777", marginBottom: 20 }}>
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          {blog.tags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: "inline-block",
                background: "#eee",
                padding: "4px 10px",
                borderRadius: 20,
                fontSize: 12,
                marginRight: 8,
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <article
        style={{
          fontSize: "1.1rem",
          lineHeight: 1.7,
          color: "#333",
        }}
      >
        {blog.content}
      </article>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const slug = context.params?.slug as string;

  try {
    const blog = await getPublicBlogBySlug(slug);

    return {
      props: { blog },
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
};
