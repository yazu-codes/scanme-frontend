import { useEffect, useRef, useState } from "react";

// Tracks which category is "active" (e.g. for highlighting a sticky nav
// pill), keeping it in sync in both directions:
//  - calling handleCategorySelect(category) scrolls to that section
//  - scrolling the page updates which category is considered active
//
// This is a sticky-nav-with-sections UI pattern, not a data concern — a
// theme with a different navigation style (e.g. a single long page, or
// a dropdown selector) is free to skip this hook entirely.
export default function useCategoryScrollSpy(categories) {
  const [activeCategory, setActiveCategory] = useState(null);
  const sectionRefs = useRef({});
  const isProgrammaticScroll = useRef(false);

  // Default to the first category once categories are known
  useEffect(() => {
    if (categories.length && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Highlight the nav pill for whichever section is currently in view
  useEffect(() => {
    if (!categories.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isProgrammaticScroll.current) return;
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const cat = visible[0].target.getAttribute("data-category");
          if (cat) setActiveCategory(cat);
        }
      },
      { rootMargin: "-120px 0px -60% 0px", threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [categories]);

  function handleCategorySelect(category) {
    setActiveCategory(category);
    const el = sectionRefs.current[category];
    if (el) {
      isProgrammaticScroll.current = true;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => {
        isProgrammaticScroll.current = false;
      }, 700);
    }
  }

  // Ref callback to attach to each category section so it can be
  // observed and scrolled to.
  function getSectionRef(category) {
    return (el) => {
      sectionRefs.current[category] = el;
      if (el) el.setAttribute("data-category", category);
    };
  }

  return { activeCategory, handleCategorySelect, getSectionRef };
}
