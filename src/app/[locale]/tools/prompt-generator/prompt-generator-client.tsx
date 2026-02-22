
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  ChevronDown, 
  ChevronUp, 
  FileText, 
  StickyNote, 
  Download, 
  Grid3X3, 
  ImageIcon, 
  Calendar, 
  CheckCircle2,
  Settings2,
  Image as LucideImage,
  Layers
} from 'lucide-react';
import { downloadLinks } from '@/lib/data-downloads';
import { useNotification } from '@/hooks/use-notification';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type DownloadItem = {
  id: string;
  type: 'id' | 'url';
  value: string;
};

export function PromptGeneratorClient({ dictionary }: { dictionary: any }) {
  const [contentType, setContentType] = useState<'blog' | 'note'>('blog');
  const [draft, setDraft] = useState('');
  
  // Feature Toggles
  const [showDownloads, setShowDownloads] = useState(false);
  const [showGrids, setShowGrids] = useState(false);
  const [showImages, setShowImages] = useState(true);

  // UI State for Expansion
  const [isDraftExpanded, setIsDraftExpanded] = useState(false);

  // Data Inputs
  const [downloadItems, setDownloadItems] = useState<DownloadItem[]>([]);
  const [imageGridMappings, setImageGridMappings] = useState('');
  const [images, setImages] = useState('');

  // Metadata
  const [publishDate, setPublishDate] = useState<string>('');
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { notify } = useNotification();

  const downloadIds = Object.keys(downloadLinks).sort();

  // Persistence for feature toggles
  useEffect(() => {
    const saved = localStorage.getItem('snipgeek-prompt-features');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setShowDownloads(!!parsed.showDownloads);
        setShowGrids(!!parsed.showGrids);
        setShowImages(parsed.showImages !== undefined ? !!parsed.showImages : true);
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('snipgeek-prompt-features', JSON.stringify({
      showDownloads,
      showGrids,
      showImages
    }));
  }, [showDownloads, showGrids, showImages]);

  // Prompt Builder Logic
  useEffect(() => {
    const buildPrompt = () => {
      const isBlog = contentType === 'blog';
      
      let prompt = isBlog
        ? `${dictionary.promptBaseBlog}\n\n`
        : `${dictionary.promptBaseNote}\n\n`;

      prompt += `**${dictionary.frontmatterDetails}:**\n`;
      prompt += `- ${dictionary.contentTypeLabel}: ${isBlog ? dictionary.contentTypeBlog : dictionary.contentTypeNote}\n`;
      prompt += `- ${dictionary.titleLabel}: [AI: Please generate a high-quality, SEO-optimized title between 50-60 characters based on the content]\n`;
      prompt += `- slug: [AI: Generate a unique kebab-case English slug. This MUST be identical for both language versions]\n`;
      prompt += `- translationKey: [AI: Generate a unique, short kebab-case key based on the topic to link both translations]\n`;
      prompt += `- ${dictionary.dateLabel}: ${publishDate || new Date().toISOString().split('T')[0]}\n`;
      
      let frontmatterStatus = `published: ${isPublished}`;
      if (isBlog) {
        frontmatterStatus += `, featured: ${isFeatured}`;
      }
      prompt += `- ${dictionary.statusLabel}: ${frontmatterStatus}\n`;

      const imageLines = images.split('\n').filter(line => line.trim() !== '');

      if (isBlog) {
        const heroImageLine = (showImages && imageLines.length > 0) ? imageLines[0] : '';
        const [heroImagePath, heroImageAlt] = heroImageLine.split('|').map(s => s ? s.trim() : '');
        prompt += `- heroImage: "${heroImagePath || "/images/blank/blank.webp"}"\n`;
        prompt += `- imageAlt: "${heroImageAlt || '[AI: PLEASE GENERATE DESCRIPTIVE SEO ALT TEXT]'}"\n`;
      }
      
      prompt += `- tags: [AI: Generate 3-5 relevant tags as an array of strings]\n`;
      prompt += `\n`;

      if (showImages && imageLines.length > (isBlog ? 1 : 0)) {
          prompt += `**${isBlog ? dictionary.supportingImagesLabel : dictionary.supportingImagesLabelNote}:**\n`;
          imageLines.slice(isBlog ? 1 : 0).forEach((line, index) => {
              const [imgPath, imgAlt] = line.split('|').map(s => s ? s.trim() : '');
              prompt += `- Image ${index + 1} Path: "${imgPath}"\n`;
              prompt += `- Image ${index + 1} Alt: "${imgAlt || '[AI: PLEASE GENERATE DESCRIPTIVE SEO ALT TEXT]'}"\n`;
          });
          prompt += `\n`;
      }

      if (showDownloads && downloadItems.length > 0) {
          prompt += `\n**${dictionary.downloadLinks.promptTitle}:**\n`;
          prompt += `${dictionary.downloadLinks.promptInstruction}\n`;
          downloadItems.forEach((item, index) => {
              if (item.type === 'id') {
                prompt += `- Placeholder [DOWNLOAD_${index + 1}] -> Use Existing ID: "${item.value}"\n`;
              } else {
                prompt += `- Placeholder [DOWNLOAD_${index + 1}] -> Use New URL: "${item.value}" (AI: recommend a suitable kebab-case ID and use it in the component)\n`;
              }
          });
          prompt += `\n`;
      }

      if (showGrids && imageGridMappings && dictionary.imageGrid) {
        prompt += `\n**${dictionary.imageGrid.promptTitle}:**\n`;
        prompt += `${dictionary.imageGrid.promptInstruction}\n`;
        const gridMappings = imageGridMappings.split('\n').filter(line => line.trim() !== '');
        gridMappings.forEach((line, index) => {
            prompt += `- Placeholder [GRID_${index + 1}] -> Paths: ${line}\n`;
            prompt += `  (AI: AUTOMATICALLY calculate the best column count [1-4] based on the number of paths provided for this grid)\n`;
        });
        prompt += `\n`;
      }

      prompt += `---\n\n`;
      prompt += `**${dictionary.draftContentLabel}:**\n\n`;
      prompt += draft;
      prompt += `\n\n---\n**${dictionary.finalInstruction}**`;
      
      setGeneratedPrompt(prompt);
    };

    buildPrompt();
  }, [draft, publishDate, isPublished, isFeatured, images, dictionary, contentType, downloadItems, imageGridMappings, showDownloads, showGrids, showImages]);

  const handleCopyMain = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setIsCopied(true);
    notify(dictionary.copiedButton);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const addDownloadItem = () => {
    setDownloadItems([...downloadItems, { id: crypto.randomUUID(), type: 'id', value: '' }]);
  };

  const removeDownloadItem = (id: string) => {
    setDownloadItems(downloadItems.filter(item => item.id !== id));
  };

  const updateDownloadItem = (id: string, updates: Partial<DownloadItem>) => {
    setDownloadItems(downloadItems.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Sidebar: Toolbar & Metadata (4/12) */}
        <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          
          {/* Minimalist Toolbar - Icons Only */}
          <Card className="bg-card/50 border-primary/10 overflow-hidden shadow-sm">
              <CardHeader className="bg-muted/20 py-3 border-b">
                  <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                    <Layers className="h-3 w-3" /> Toolbar
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-6">
                  {/* Content Type Toggles */}
                  <div className="flex justify-center gap-2 p-1 bg-muted/30 rounded-xl">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={contentType === 'blog' ? 'default' : 'ghost'} 
                              onClick={() => setContentType('blog')}
                              className="flex-1 h-12 rounded-lg transition-all"
                            >
                              <FileText className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.contentTypeBlog}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={contentType === 'note' ? 'default' : 'ghost'} 
                              onClick={() => setContentType('note')}
                              className="flex-1 h-12 rounded-lg transition-all"
                            >
                              <StickyNote className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.contentTypeNote}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </div>

                  {/* Feature Toggles - Large Icons */}
                  <div className="grid grid-cols-3 gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={showDownloads ? 'secondary' : 'outline'} 
                              onClick={() => setShowDownloads(!showDownloads)}
                              className={cn("h-14 rounded-xl border-dashed border-primary/20", showDownloads && "bg-primary/10 text-primary border-primary/40")}
                            >
                              <Download className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.features.downloads}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={showGrids ? 'secondary' : 'outline'} 
                              onClick={() => setShowGrids(!showGrids)}
                              className={cn("h-14 rounded-xl border-dashed border-primary/20", showGrids && "bg-primary/10 text-primary border-primary/40")}
                            >
                              <Grid3X3 className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.features.grids}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant={showImages ? 'secondary' : 'outline'} 
                              onClick={() => setShowImages(!showImages)}
                              className={cn("h-14 rounded-xl border-dashed border-primary/20", showImages && "bg-primary/10 text-primary border-primary/40")}
                            >
                              <LucideImage className="h-6 w-6" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent><p>{dictionary.features.images}</p></TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                  </div>
              </CardContent>
          </Card>

          {/* Metadata Card - Compact */}
          <Card className="bg-card/50 border-primary/10 shadow-sm">
            <CardHeader className="bg-muted/20 py-3 border-b">
              <CardTitle className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-muted-foreground">
                <Calendar className="h-3 w-3" /> Metadata
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="publishDate" className="text-[10px] font-bold uppercase text-muted-foreground">{dictionary.publishDateLabel}</Label>
                <Input
                    id="publishDate"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    placeholder={dictionary.publishDatePlaceholder || 'YYYY-MM-DD'}
                    className="bg-background/50 h-9 rounded-lg text-sm"
                />
              </div>
              
              <div className="grid gap-2 pt-2 border-t border-primary/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-muted-foreground" />
                      <Label htmlFor="published" className="text-[10px] font-bold uppercase cursor-pointer">{dictionary.publishSwitchLabel}</Label>
                    </div>
                    <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
                </div>
                {contentType === 'blog' && (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Plus className="h-3 w-3 text-muted-foreground" />
                          <Label htmlFor="featured" className="text-[10px] font-bold uppercase cursor-pointer">{dictionary.featuredSwitchLabel}</Label>
                        </div>
                        <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area (8/12) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Draft Area */}
          <Card className="bg-card/50 border-primary/10 min-h-[400px] flex flex-col overflow-hidden shadow-md">
            <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/10 px-6 py-4">
              <CardTitle className="text-lg font-headline flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg"><FileText className="h-5 w-5 text-primary" /></div>
                {dictionary.draftTitle}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsDraftExpanded(!isDraftExpanded)} className="h-8 w-8 rounded-full">
                {isDraftExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="flex-1 p-0 flex flex-col">
              <Textarea
                placeholder={dictionary.draftPlaceholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={cn(
                    "w-full border-none rounded-none bg-transparent font-mono text-sm p-6 resize-none focus-visible:ring-0 leading-relaxed transition-all duration-300 flex-1",
                    isDraftExpanded ? "min-h-[800px]" : "min-h-[300px]"
                )}
              />
            </CardContent>
          </Card>

          {/* Feature Configuration Areas - Appear below content */}
          {showImages && (
            <Card className="bg-card/50 border-primary/10 overflow-hidden shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="bg-muted/20 py-3 border-b flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <LucideImage className="h-4 w-4 text-primary" /> {contentType === 'blog' ? dictionary.imagesTitle : dictionary.imagesTitleNote}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                  <Textarea
                      placeholder={contentType === 'blog' ? dictionary.imagesPlaceholder : dictionary.imagesPlaceholderNote}
                      value={images}
                      onChange={(e) => setImages(e.target.value)}
                      className="font-mono text-[13px] bg-background/50 rounded-xl p-4 min-h-[150px] leading-relaxed"
                  />
                  <p className="mt-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1 leading-tight">
                      {contentType === 'blog' ? dictionary.imagesDescription : dictionary.imagesDescriptionNote}
                  </p>
              </CardContent>
            </Card>
          )}

          {showDownloads && (
            <Card className="bg-card/50 border-primary/10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
                <CardHeader className="border-b bg-muted/10 px-6 py-4">
                    <CardTitle className="text-sm font-bold flex items-center gap-2">
                      <Download className="h-4 w-4 text-primary" /> {dictionary.downloadLinks.title}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {downloadItems.map((item, index) => (
                        <div key={item.id} className="flex flex-col gap-2 p-4 border rounded-xl bg-background/30 relative group transition-all hover:bg-background/50">
                            <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-[10px] font-bold px-2 py-0.5 rounded-md">[DOWNLOAD_{index + 1}]</Badge>
                            <Button variant="ghost" size="icon" onClick={() => removeDownloadItem(item.id)} className="h-7 w-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            </div>
                            
                            <div className="flex gap-2">
                            <Select value={item.type} onValueChange={(val) => updateDownloadItem(item.id, { type: val as 'id' | 'url', value: '' })}>
                                <SelectTrigger className="w-[90px] h-9 text-xs rounded-lg">
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="id">ID</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                </SelectContent>
                            </Select>

                            {item.type === 'id' ? (
                                <Select value={item.value} onValueChange={(val) => updateDownloadItem(item.id, { value: val })}>
                                <SelectTrigger className="flex-1 h-9 text-xs rounded-lg">
                                    <SelectValue placeholder="..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {downloadIds.map(id => <SelectItem key={id} value={id}>{id}</SelectItem>)}
                                </SelectContent>
                                </Select>
                            ) : (
                                <Input 
                                placeholder="URL..." 
                                value={item.value} 
                                onChange={(e) => updateDownloadItem(item.id, { value: e.target.value })}
                                className="flex-1 h-9 text-xs bg-background/50 rounded-lg"
                                />
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                    <Button onClick={addDownloadItem} variant="outline" size="sm" className="w-full h-11 border-dashed rounded-xl bg-background/20 hover:bg-primary/5">
                      <Plus className="h-4 w-4 mr-2" /> {dictionary.downloadLinks.addDownload || "Add Download Item"}
                    </Button>
                </CardContent>
            </Card>
          )}

          {showGrids && (
            <Card className="bg-card/50 border-primary/10 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
              <CardHeader className="border-b bg-muted/10 px-6 py-4">
                  <CardTitle className="text-sm font-bold flex items-center gap-2">
                    <Grid3X3 className="h-4 w-4 text-primary" /> {dictionary.imageGrid.title}
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                  <Textarea
                      placeholder={dictionary.imageGrid.placeholder}
                      value={imageGridMappings}
                      onChange={(e) => setImageGridMappings(e.target.value)}
                      className="min-h-[120px] font-mono text-sm bg-background/50 rounded-xl p-4 leading-relaxed"
                  />
                  <p className="mt-3 text-[10px] text-muted-foreground uppercase font-bold tracking-widest pl-1">
                    {dictionary.imageGrid.description || "Paste image paths per line. Columns will be calculated automatically."}
                  </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Generated Result Section - Wide Card below inputs */}
      <Card className="border-primary/20 shadow-2xl overflow-hidden mt-8 ring-4 ring-primary/5">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between border-b bg-muted/30 py-5 px-8 gap-4">
          <CardTitle className="text-xl font-headline flex items-center gap-3">
            <div className="p-1.5 bg-green-500/10 rounded-full">
                <Check className="h-5 w-5 text-green-600" />
            </div>
            {dictionary.generatedPromptTitle}
          </CardTitle>
          <Button onClick={handleCopyMain} variant="default" size="lg" className="gap-2 px-8 rounded-full shadow-lg h-12 transition-transform active:scale-95">
            {isCopied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
            {isCopied ? dictionary.copiedButton : dictionary.copyButton}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Textarea
            readOnly
            value={generatedPrompt}
            className="min-h-[500px] border-none rounded-none bg-muted/5 font-mono text-sm p-8 resize-none focus-visible:ring-0 leading-loose"
          />
        </CardContent>
      </Card>
    </div>
  );
}
