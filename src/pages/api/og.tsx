import { ImageResponse } from 'next/og'; 
import { NextRequest } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function handler(request: NextRequest) {
  try {
    const { searchParams, origin } = new URL(request.url);

    const title = searchParams.get("title") || "Untitled Post";
    const author = searchParams.get("author") || "Wordoo Author";
    const image = searchParams.get("image");


    const fontData = await fetch(
      new URL("/fonts/InterDisplay-Bold.ttf", origin)
    ).then((res) => {
      if (!res.ok) throw new Error("Font file not found in public/fonts/");
      return res.arrayBuffer();
    });

    return new ImageResponse(
      (
        <div tw="flex flex-col w-full h-full bg-slate-900 text-white p-12 justify-between">

          <div tw="absolute inset-0 opacity-10 flex flex-wrap" style={{ fontSize: '100px', fontWeight: 'bold' }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <span key={i} tw="mr-10 mb-10">WORDOO</span>
            ))}
          </div>

          <div tw="flex flex-col relative z-10">

            <div tw="flex items-center mb-8">
              <div tw="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center mr-3">
                <span tw="text-white font-bold">W</span>
              </div>
              <span tw="text-2xl font-black tracking-tighter">WORD<span tw="text-indigo-500">oo</span></span>
            </div>


            <h1 tw="text-7xl font-black leading-tight tracking-tight mb-4">
              {title}
            </h1>
          </div>

          <div tw="flex items-center justify-between relative z-10">
             <div tw="flex items-center">

                <div tw="flex flex-col">
                  <span tw="text-indigo-400 text-sm font-bold uppercase tracking-widest">Written By</span>
                  <span tw="text-2xl font-bold">{author}</span>
                </div>
             </div>

             {image && (
               <img 
                 src={image} 
                 tw="w-48 h-32 rounded-2xl object-cover border-4 border-white/10 shadow-2xl" 
               />
             )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, { status: 500 });
  }
};









