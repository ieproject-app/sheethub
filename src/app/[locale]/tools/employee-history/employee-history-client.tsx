
'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { getDictionary } from '@/lib/get-dictionary'
import { parse, isValid } from 'date-fns'
import { cn } from '@/lib/utils'
import { Search, FileText, UserCheck, Plus, Trash2 } from 'lucide-react'

// --- TYPE DEFINITIONS ---
interface Pejabat {
  grupJabatan: string;
  tglMulai: Date;
  tglSelesai: Date;
  nama: string;
  jabatan: string;
  nik: string;
}

interface DocRule {
  [key: string]: string[];
}

interface DocQuery {
  id: number;
  docType: string;
  docDate: string;
  projectValue: number;
}

interface GeneratedResult {
    [key: string]: Pejabat[];
}

// --- CONSTANTS ---
const docRules: DocRule = {
  'ND UT': ['MGR KONSTRUKSI'],
  'BAUT LAUT': ['SM KONSTRUKSI', 'MGR KONSTRUKSI', 'GM'],
  'BA ABD': ['SM KONSTRUKSI', 'MGR KONSTRUKSI'],
  'BA REKON': ['MGR KONSTRUKSI', 'GM'],
  'BA MATERIAL': ['TL WH', 'MGR SS', 'SM KONSTRUKSI', 'MGR KONSTRUKSI'],
  'AMD PENUTUP': ['GM'],
  'BAST': ['GM'],
};

// --- HELPER FUNCTIONS ---
const parseDate = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  if (year === 9999) return new Date(9999, 11, 31);
  return new Date(year, month - 1, day);
};

const tryParseDate = (text: string): Date | null => {
  if (!text) return null;
  const formats = ['d MMMM yyyy', 'd MMM yyyy', 'd MMMM', 'd MMM', 'd/M/yyyy', 'd/M/yy'];
  for (const format of formats) {
    const parsedDate = parse(text, format, new Date());
    if (isValid(parsedDate)) return parsedDate;
  }
  return null;
};

const formatDate = (date: Date, locale: string = 'id-ID') => {
    return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EmployeeHistoryClient({ 
  dictionary, 
  employeeData,
  locale
}: { 
  dictionary: Awaited<ReturnType<typeof getDictionary>>,
  employeeData: string,
  locale: string
}) {
  const { employeeHistory: t } = dictionary;

  const allPejabat = useMemo<Pejabat[]>(() => {
    if (!employeeData) return [];
    const lines = employeeData.trim().split(/\r?\n/).slice(1);
    return lines.map(line => {
      const [grupJabatan, tglMulai, tglSelesai, nama, jabatan, nik] = line.split('\t');
      return { 
        grupJabatan, 
        tglMulai: parseDate(tglMulai), 
        tglSelesai: parseDate(tglSelesai), 
        nama, 
        jabatan, 
        nik 
      };
    }).filter(p => p.nama);
  }, [employeeData]);

  // State for Employee History
  const [searchText, setSearchText] = useState<string>('');
  const [searchGrup, setSearchGrup] = useState<string>('all');
  const [filteredPejabat, setFilteredPejabat] = useState<Pejabat[]>(allPejabat);

  // State for Document Signer Generator
  const [docQueries, setDocQueries] = useState<DocQuery[]>([{ id: Date.now(), docType: '', docDate: '', projectValue: 0 }]);
  const [generatedResults, setGeneratedResults] = useState<GeneratedResult>({});

  const uniqueGrupJabatans = useMemo(() => 
    ['all', ...Array.from(new Set(allPejabat.map(p => p.grupJabatan)))]
  , [allPejabat]);

  useEffect(() => {
    const parsedDate = tryParseDate(searchText);
    const lowerSearchText = searchText.toLowerCase();

    const results = allPejabat
      .filter(p => {
        const isGrupMatch = searchGrup === 'all' || p.grupJabatan === searchGrup;
        if (!isGrupMatch) return false;

        if (parsedDate) {
          return p.tglMulai <= parsedDate && p.tglSelesai >= parsedDate;
        } else if (lowerSearchText) {
          return p.nama.toLowerCase().includes(lowerSearchText) || (p.nik && p.nik.toLowerCase().includes(lowerSearchText));
        } else {
          return true;
        }
      })
      .sort((a, b) => {
        const aIsActive = a.tglSelesai.getFullYear() === 9999;
        const bIsActive = b.tglSelesai.getFullYear() === 9999;
        if (aIsActive && !bIsActive) return -1;
        if (!aIsActive && bIsActive) return 1;
        return a.nama.localeCompare(b.nama);
      });

    setFilteredPejabat(results);
  }, [searchText, searchGrup, allPejabat]);

  const handleQueryChange = (id: number, field: keyof DocQuery, value: string | number) => {
    setDocQueries(queries => 
        queries.map(q => q.id === id ? { ...q, [field]: value } : q)
    );
  };

  const addQueryRow = () => {
    setDocQueries(queries => [...queries, { id: Date.now(), docType: '', docDate: '', projectValue: 0 }]);
  };

  const removeQueryRow = (id: number) => {
    setDocQueries(queries => queries.filter(q => q.id !== id));
  };

  const handleGenerateSigners = () => {
    const results: GeneratedResult = {};
    docQueries.forEach(query => {
      if (!query.docType || !query.docDate) return;
      
      const targetDate = new Date(query.docDate);
      let requiredGrups = docRules[query.docType] || [];

      if (['AMD PENUTUP', 'BAST'].includes(query.docType) && query.projectValue > 500000000) {
        requiredGrups = ['OSM'];
      }

      const signers = requiredGrups.flatMap(grup => 
        allPejabat.filter(p => 
          p.grupJabatan === grup && p.tglMulai <= targetDate && p.tglSelesai >= targetDate
        )
      );
      const key = `${query.docType} (${formatDate(targetDate, locale)})`;
      results[key] = signers;
    });
    setGeneratedResults(results);
  };

  return (
    <div className="space-y-12">
      {/* Search Section */}
      <Card className="border bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <Search className="h-5 w-5 text-primary" />
            </div>
            <div>
                <CardTitle className="font-headline text-xl">{t.searchTitle}</CardTitle>
                <CardDescription>{t.searchDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder={t.searchPlaceholder} 
                    value={searchText} 
                    onChange={e => setSearchText(e.target.value)} 
                    className="pl-10 h-11 rounded-xl bg-background/50 border-muted focus-visible:ring-primary/20" 
                />
            </div>
            <Select value={searchGrup} onValueChange={setSearchGrup}>
                <SelectTrigger className="w-full sm:w-[200px] h-11 rounded-xl bg-background/50 border-muted">
                    <SelectValue placeholder={t.groupPlaceholder} />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                    {uniqueGrupJabatans.map(grup => (
                        <SelectItem key={grup} value={grup}>{grup === 'all' ? t.allGroups : grup}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>

          <div className="relative rounded-xl border bg-background/50 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-bold py-4">{t.nameHeader}</TableHead>
                        <TableHead className="font-bold">{t.positionHeader}</TableHead>
                        <TableHead className="font-bold">{t.groupHeader}</TableHead>
                        <TableHead className="font-bold">{t.nikHeader}</TableHead>
                        <TableHead className="font-bold">{t.startDateHeader}</TableHead>
                        <TableHead className="font-bold whitespace-nowrap">{t.endDateHeader}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredPejabat.map((p, i) => {
                    const isActive = p.tglSelesai.getFullYear() === 9999;
                    return (
                        <TableRow key={`${p.nik}-${i}`} className={cn("transition-colors", isActive ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50')}>
                        <TableCell className="py-4 font-medium">{p.nama}</TableCell>
                        <TableCell className="text-muted-foreground">{p.jabatan}</TableCell>
                        <TableCell>
                            <span className="px-2 py-1 rounded-full bg-muted text-[10px] font-bold tracking-wider uppercase text-muted-foreground border">
                                {p.grupJabatan}
                            </span>
                        </TableCell>
                        <TableCell className="font-code text-xs tracking-wider">{p.nik}</TableCell>
                        <TableCell className="font-code text-xs whitespace-nowrap">{formatDate(p.tglMulai, locale)}</TableCell>
                        <TableCell className={cn("font-code text-xs whitespace-nowrap", isActive && "text-primary font-bold")}>
                            {isActive ? t.present : formatDate(p.tglSelesai, locale)}
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </div>
            {filteredPejabat.length === 0 && (
                <div className="p-12 text-center text-muted-foreground bg-muted/10">
                    No matching records found.
                </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generator Section */}
      <Card className="border bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
                <CardTitle className="font-headline text-xl">{t.generatorTitle}</CardTitle>
                <CardDescription>{t.generatorDescription}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {docQueries.map((query, index) => (
                <div key={query.id} className="flex flex-col md:flex-row items-end gap-4 p-5 border rounded-xl bg-background/30 relative group">
                    <div className="w-full md:flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.docTypePlaceholder}</label>
                        <Select value={query.docType} onValueChange={value => handleQueryChange(query.id, 'docType', value)}>
                            <SelectTrigger className="h-11 rounded-xl bg-background/50"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {Object.keys(docRules).map(doc => <SelectItem key={doc} value={doc}>{doc}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:flex-1 space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.startDateHeader}</label>
                        <Input type="date" value={query.docDate} onChange={e => handleQueryChange(query.id, 'docDate', e.target.value)} className="h-11 rounded-xl bg-background/50" />
                    </div>
                    {(query.docType === 'AMD PENUTUP' || query.docType === 'BAST') && (
                        <div className="w-full md:flex-1 space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t.projectValuePlaceholder}</label>
                            <Input type="number" value={query.projectValue} onChange={e => handleQueryChange(query.id, 'projectValue', parseInt(e.target.value))} className="h-11 rounded-xl bg-background/50" />
                        </div>
                    )}
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeQueryRow(query.id)} 
                        disabled={docQueries.length <= 1}
                        className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button onClick={addQueryRow} variant="outline" className="flex-1 rounded-xl h-11 border-dashed">
                <Plus className="mr-2 h-4 w-4" /> Add Another Document
            </Button>
            <Button onClick={handleGenerateSigners} className="flex-1 rounded-xl h-11 shadow-lg shadow-primary/20">
                <UserCheck className="mr-2 h-4 w-4" /> Generate Signers
            </Button>
          </div>
          
          {Object.keys(generatedResults).length > 0 && (
            <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="flex items-center gap-2 border-b pb-2">
                  <UserCheck className="h-5 w-5 text-primary" />
                  <h3 className="font-headline text-lg font-bold">Results</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(generatedResults).map(([key, signers]) => (
                    <div key={key} className="space-y-4">
                        <div className="inline-block px-3 py-1 rounded-md bg-primary text-primary-foreground text-xs font-bold tracking-tight">
                            {key}
                        </div>
                        <div className="overflow-hidden border rounded-xl bg-background/50">
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-bold py-3">{t.groupHeader}</TableHead>
                                        <TableHead className="font-bold">{t.nameHeader}</TableHead>
                                        <TableHead className="font-bold">{t.positionHeader}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {signers.length > 0 ? signers.map((p, i) => (
                                    <TableRow key={`${p.nik}-${i}`} className="hover:bg-muted/30">
                                        <TableCell>
                                            <Badge variant="outline" className="rounded-md uppercase text-[10px] tracking-wider">{p.grupJabatan}</Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{p.nama}</TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{p.jabatan}</TableCell>
                                    </TableRow>
                                    )) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground italic">No signers found for this date.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
