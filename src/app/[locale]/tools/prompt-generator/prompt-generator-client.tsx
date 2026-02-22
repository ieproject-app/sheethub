
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { downloadLinks } from '@/lib/data-downloads';
import { useNotification } from '@/hooks/use-notification';
import { cn } from '@/lib/utils';

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

  // UI State for "Lihat Selengkapnya"
  const [isDraftExpanded, setIsDraftExpanded] = useState(false);
  const [isImagesExpanded, setIsImagesExpanded] = useState(false);

  // Download Items & Grid Logic
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

  // Load persisted features
  useEffect(() => {
    const savedFeatures = localStorage.getItem('snipgeek-prompt-features');
    if (savedFeatures) {
      try {
        const parsed = JSON.parse(savedFeatures);
        setShowDownloads(!!parsed.showDownloads);
        setShowGrids(!!parsed.showGrids);
        setShowImages(parsed.showImages !== undefined ? !!parsed.showImages : true);
      } catch (e) {}
    }
  }, []);

  // Save features on change
  useEffect(() => {
    localStorage.setItem('snipgeek-prompt-features', JSON.stringify({
      showDownloads,
      showGrids,
      showImages
    }));
  }, [showDownloads, showGrids, showImages]);

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
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Toggles & Metadata (4/12) */}
        <div className="lg:col-span-5 space-y-8">
          <Card className="bg-card/50 border-primary/5">
              <CardHeader>
                  <CardTitle className="text-lg">{dictionary.contentTypeLabel}</CardTitle>
              </CardHeader>
              <CardContent>
                  <RadioGroup value={contentType} onValueChange={(value) => setContentType(value as 'blog' | 'note')} className="flex flex-col sm:flex-row gap-4">
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="blog" id="r-blog" />
                          <Label htmlFor="r-blog" className="cursor-pointer font-medium">{dictionary.contentTypeBlog}</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                          <RadioGroupItem value="note" id="r-note" />
                          <Label htmlFor="r-note" className="cursor-pointer font-medium">{dictionary.contentTypeNote}</Label>
                      </div>
                  </RadioGroup>
              </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/5">
              <CardHeader>
                  <CardTitle className="text-lg">{dictionary.features.title}</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-background/30">
                      <Label htmlFor="f-downloads" className="cursor-pointer text-sm">{dictionary.features.downloads}</Label>
                      <Switch id="f-downloads" checked={showDownloads} onCheckedChange={setShowDownloads} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-background/30">
                      <Label htmlFor="f-grids" className="cursor-pointer text-sm">{dictionary.features.grids}</Label>
                      <Switch id="f-grids" checked={showGrids} onCheckedChange={setShowGrids} />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border bg-background/30 sm:col-span-2">
                      <Label htmlFor="f-images" className="cursor-pointer text-sm">{dictionary.features.images}</Label>
                      <Switch id="f-images" checked={showImages} onCheckedChange={setShowImages} />
                  </div>
              </CardContent>
          </Card>

          <Card className="bg-card/50 border-primary/5">
            <CardHeader>
              <CardTitle className="text-lg">{dictionary.metadataTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label htmlFor="publishDate" className="text-sm">{dictionary.publishDateLabel}</Label>
                <Input
                    id="publishDate"
                    value={publishDate}
                    onChange={(e) => setPublishDate(e.target.value)}
                    placeholder={dictionary.publishDatePlaceholder || 'YYYY-MM-DD'}
                    className="bg-background/50"
                />
              </div>
              
              <div className="grid gap-3">
                <Label className="text-sm">{dictionary.statusLabel}</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center justify-between p-3 rounded-lg border bg-background/30">
                        <Label htmlFor="published" className="text-xs font-normal cursor-pointer">{dictionary.publishSwitchLabel}</Label>
                        <Switch id="published" checked={isPublished} onCheckedChange={setIsPublished} />
                    </div>
                    {contentType === 'blog' && (
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-background/30">
                            <Label htmlFor="featured" className="text-xs font-normal cursor-pointer">{dictionary.featuredSwitchLabel}</Label>
                            <Switch id="featured" checked={isFeatured} onCheckedChange={setIsFeatured} />
                        </div>
                    )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Main Inputs (7/12) */}
        <div className="lg:col-span-7 space-y-8">
          <Card className="bg-card/50 border-primary/5 h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{dictionary.draftTitle}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsDraftExpanded(!isDraftExpanded)}>
                {isDraftExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              <Textarea
                placeholder={dictionary.draftPlaceholder}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                className={cn(
                    "w-full bg-background/50 font-mono text-sm transition-all duration-300",
                    isDraftExpanded ? "min-h-[600px]" : "min-h-[300px]"
                )}
              />
            </CardContent>
          </Card>

          {showDownloads && (
            <Card className="bg-card/50 border-primary/5">
                <CardHeader>
                    <CardTitle className="text-lg">{dictionary.downloadLinks.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {downloadItems.map((item, index) => (
                        <div key={item.id} className="flex flex-col gap-2 p-3 border rounded-lg bg-background/30 relative group">
                            <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-[10px] font-bold">[DOWNLOAD_{index + 1}]</Badge>
                            <Button variant="ghost" size="icon" onClick={() => removeDownloadItem(item.id)} className="h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-3 w-3" />
                            </Button>
                            </div>
                            
                            <div className="flex gap-2">
                            <Select value={item.type} onValueChange={(val) => updateDownloadItem(item.id, { type: val as 'id' | 'url', value: '' })}>
                                <SelectTrigger className="w-[80px] h-8 text-xs">
                                <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                <SelectItem value="id">ID</SelectItem>
                                <SelectItem value="url">URL</SelectItem>
                                </SelectContent>
                            </Select>

                            {item.type === 'id' ? (
                                <Select value={item.value} onValueChange={(val) => updateDownloadItem(item.id, { value: val })}>
                                <SelectTrigger className="flex-1 h-8 text-xs">
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
                                className="flex-1 h-8 text-xs bg-background/50"
                                />
                            )}
                            </div>
                        </div>
                        ))}
                    </div>
                    <Button onClick={addDownloadItem} variant="outline" size="sm" className="w-full border-dashed">
                      <Plus className="h-4 w-4 mr-2" /> {dictionary.downloadLinks.addDownload || "Add Download Item"}
                    </Button>
                </CardContent>
            </Card>
          )}

          {showGrids && (
            <Card className="bg-card/50 border-primary/5">
              <CardHeader>
                  <CardTitle className="text-lg">{dictionary.imageGrid.title}</CardTitle>
              </CardHeader>
              <CardContent>
                  <Textarea
                      placeholder={dictionary.imageGrid.placeholder}
                      value={imageGridMappings}
                      onChange={(e) => setImageGridMappings(e.target.value)}
                      className="min-h-[80px] font-mono text-xs bg-background/50"
                  />
                  <p className="mt-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {dictionary.imageGrid.description || "Just paste paths separated by comma per line. AI will calculate columns."}
                  </p>
              </CardContent>
            </Card>
          )}

          {showImages && (
          <Card className="bg-card/50 border-primary/5">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{contentType === 'blog' ? dictionary.imagesTitle : dictionary.imagesTitleNote}</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setIsImagesExpanded(!isImagesExpanded)}>
                {isImagesExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
                <Textarea
                    placeholder={contentType === 'blog' ? dictionary.imagesPlaceholder : dictionary.imagesPlaceholderNote}
                    value={images}
                    onChange={(e) => setImages(e.target.value)}
                    className={cn(
                        "font-mono text-xs bg-background/50 transition-all duration-300",
                        isImagesExpanded ? "min-h-[300px]" : "min-h-[100px]"
                    )}
                />
                <p className="mt-2 text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                    {contentType === 'blog' ? dictionary.imagesDescription : dictionary.imagesDescriptionNote}
                </p>
            </CardContent>
          </Card>
          )}
        </div>
      </div>

      <Card className="border-primary/20 shadow-xl overflow-hidden mt-12">
        <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30 py-4 px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            {dictionary.generatedPromptTitle}
          </CardTitle>
          <Button onClick={handleCopyMain} variant="default" size="sm" className="gap-2 px-6 rounded-full shadow-lg">
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {isCopied ? dictionary.copiedButton : dictionary.copyButton}
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <Textarea
            readOnly
            value={generatedPrompt}
            className="min-h-[400px] border-none rounded-none bg-muted/5 font-mono text-xs p-6 resize-none focus-visible:ring-0 leading-relaxed"
          />
        </CardContent>
      </Card>
    </div>
  );
}
