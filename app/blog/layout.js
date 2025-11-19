// app/blog/layout.js
export const metadata = {
    title: "Kappa Theta Pi UTD - Blog",
    description: "Keep up with our blog to stay updated on our latest events and news",
  };
  
  export default function BlogLayout({ children }) {
    return (
      <div>
        {children}
      </div>
    );
  }