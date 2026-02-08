import { GetServerSideProps } from "next";
import { getPublicBlogBySlug } from "@/src/services/blogs";

type Blog = {
  title: string;
  content: string;
  createdAt: string;
};

type Props = {
  blog: Blog;
};

export default function BlogPage({ blog }: Props) {
  return (
    <div style={{ maxWidth: 700, margin: "40px auto", padding: 20 }}>
      <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>
        {blog.title}
      </h1>

      <p style={{ color: "#666", fontSize: "0.9rem" }}>
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      <div style={{ marginTop: 20 }}>
        {blog.content}
      </div>
    </div>
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
