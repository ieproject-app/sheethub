
import { getSortedPostsData, type Post, type PostFrontmatter } from '@/lib/posts';
import { getSortedNotesData, type Note, type NoteFrontmatter } from '@/lib/notes';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { getDictionary } from '@/lib/get-dictionary';
import { AddToReadingListButton } from '@/components/layout/add-to-reading-list-button';
import { i18n } from '@/i18n-config';
import { StickyNote } from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';

type RelatedPostsProps = {
  type: 'blog' | 'note';
  locale: string;
  currentSlug: string;
  currentTags?: string[];
  currentCategory?: string;
};

const getRelatedContent = (
  type: 'blog' | 'note',
  locale: string,
  currentSlug: string,
  currentTags: string[] = [],
  currentCategory?: string
): (Post<PostFrontmatter> | Note<NoteFrontmatter>)[] => {
  const allContent = type === 'blog' ? getSortedPostsData(locale) : getSortedNotesData(locale);
  const otherContent = allContent.filter(item => item.slug !== currentSlug);

  const scoredContent = otherContent.map(item => {
    let score = 0;
    const itemTags = item.frontmatter.tags || [];
    const itemCategory = (item.frontmatter as PostFrontmatter).category;

    if (type === 'blog' && currentCategory && itemCategory && currentCategory === itemCategory) {
      score += 5;
    }

    currentTags.forEach(tag => {
      if (itemTags.includes(tag)) {
        score += 1;
      }
    });

    return { ...item, score };
  })
  .filter(item => item.score > 0)
  .sort((a, b) => b.score - a.score);

  const topN = scoredContent.slice(0, 10);
  for (let i = topN.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [topN[i], topN[j]] = [topN[j], topN[i]];
  }
  
  const relatedCount = 3;
  let related = topN.slice(0, relatedCount);
  
  if (related.length < relatedCount) {
    const moreNeeded = relatedCount - related.length;
    const latestContent = otherContent
      .filter(item => !related.some(r => r.slug === item.slug))
      .filter(item => !scoredContent.some(s => s.slug === item.slug))
      .slice(0, moreNeeded);
    related.push(...latestContent);
  }

  return related;
};

export async function RelatedPosts({ type, locale, currentSlug, currentTags, currentCategory }: RelatedPostsProps) {
  const relatedContent = getRelatedContent(type, locale, currentSlug, currentTags, currentCategory);

  if (relatedContent.length === 0) {
    return null;
  }
  
  const dictionary = await getDictionary(locale);
  const linkPrefix = locale === i18n.defaultLocale ? '' : `/${locale}`;

  const renderBlogPostCard = (post: Post<PostFrontmatter>) => {
    const heroImageValue = post.frontmatter.heroImage;
    let heroImageSrc: string | undefined;
    let heroImageHint: string | undefined;

    if (heroImageValue) {
        if (heroImageValue.startsWith('http') || heroImageValue.startsWith('/')) {
            heroImageSrc = heroImageValue;
            heroImageHint = post.frontmatter.imageAlt || post.frontmatter.title;
        } else {
            const placeholder = PlaceHolderImages.find(p => p.id === heroImageValue);
            if (placeholder) {
                heroImageSrc = placeholder.imageUrl;
                heroImageHint = placeholder.imageHint;
            }
        }
    }

    const item = {
        slug: post.slug,
        title: post.frontmatter.title,
        description: post.frontmatter.description,
        href: `${linkPrefix}/blog/${post.slug}`,
        type: 'blog' as const,
    };
    
    return (
        <div key={post.slug} className="group relative transition-all duration-500 hover:-translate-y-1">
            <Link href={`${linkPrefix}/blog/${post.slug}`} className="block" aria-label={`Read more about ${post.frontmatter.title}`}>
                <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 shadow-sm transition-all duration-500 border border-primary/5">
                    {heroImageSrc && (
                        <Image
                            src={heroImageSrc}
                            alt={post.frontmatter.imageAlt || post.frontmatter.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                            data-ai-hint={heroImageHint}
                        />
                    )}
                </div>

                {post.frontmatter.category && (
                    <p className="text-[10px] font-medium tracking-wider text-accent mb-1.5">
                        {post.frontmatter.category}
                    </p>
                )}
                <h3 className="font-headline text-base font-bold tracking-tight text-primary transition-colors group-hover:text-accent leading-tight">
                    {post.frontmatter.title}
                </h3>
                <time className="text-[10px] font-medium text-muted-foreground mt-2 block opacity-60">
                    {formatRelativeTime(new Date(post.frontmatter.date), locale)}
                </time>
            </Link>
            <AddToReadingListButton 
                item={item}
                showText={false}
                dictionary={dictionary.readingList}
                className="absolute top-3 right-3 z-10 text-white bg-black/30 hover:bg-black/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
            />
        </div>
    );
  }

  const renderNoteCard = (note: Note<NoteFrontmatter>) => {
    const item = {
        slug: note.slug,
        title: note.frontmatter.title,
        description: note.frontmatter.description,
        href: `${linkPrefix}/notes/${note.slug}`,
        type: 'note' as const
    };

    return (
      <div key={note.slug} className="group relative transition-all duration-500 hover:-translate-y-1">
        <Link href={`${linkPrefix}/notes/${note.slug}`} className="block" aria-label={note.frontmatter.title}>
            <div className="relative w-full aspect-video overflow-hidden rounded-lg mb-4 shadow-sm transition-all duration-500 border border-primary/5 bg-primary/5 flex items-center justify-center">
                <StickyNote className="h-12 w-12 text-primary/20 transition-transform duration-700 group-hover:scale-110" />
            </div>
            
            <p className="text-[10px] font-medium tracking-wider text-accent mb-1.5 uppercase">
                {dictionary.navigation.notes}
            </p>
            
            <h3 className="font-headline text-base font-bold tracking-tight text-primary transition-colors group-hover:text-accent leading-tight">
                {note.frontmatter.title}
            </h3>
            
            <time className="text-[10px] font-medium text-muted-foreground mt-2 block opacity-60">
                {formatRelativeTime(new Date(note.frontmatter.date), locale)}
            </time>
        </Link>
        <AddToReadingListButton 
            item={item}
            showText={false}
            dictionary={dictionary.readingList}
            className="absolute top-3 right-3 z-10 text-white bg-black/30 hover:bg-black/50 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
        />
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t mt-16">
      <h2 className="text-3xl font-bold font-headline tracking-tighter text-primary mb-12 text-center">
        {dictionary.post.relatedContent}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-12">
        {relatedContent.map(item => 
            type === 'blog' 
                ? renderBlogPostCard(item as Post<PostFrontmatter>)
                : renderNoteCard(item as Note<NoteFrontmatter>)
        )}
      </div>
    </section>
  );
}
