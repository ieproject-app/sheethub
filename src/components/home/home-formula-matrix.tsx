"use client";

import React, { useState } from "react";
import { Search, Sparkles, FileSpreadsheet, Layers, Calculator, Zap } from "lucide-react";
import { FormulaCard } from "@/components/cards/formula-card";
import type { Post } from "@/lib/posts";
import type { Dictionary } from "@/lib/get-dictionary";

interface FormulaExplorerProps {
  posts: Post[];
  dictionary?: Dictionary;
}

const FORMULA_CATEGORIES = [
  { id: "all", label: "All Formulas", icon: Calculator },
  { id: "lookup", label: "Lookup & Reference", icon: Search, hint: "XLOOKUP, VLOOKUP, INDEX MATCH" },
  { id: "arrays", label: "Dynamic Arrays", icon: Zap, hint: "UNIQUE, SORT, FILTER, ARRAYFORMULA" },
  { id: "excel", label: "Microsoft Excel", icon: FileSpreadsheet, hint: "M365 Functions & Models" },
  { id: "sheets", label: "Google Sheets", icon: Layers, hint: "Apps Script & Cloud Formulas" },
  { id: "ai", label: "AI & Copilot", icon: Sparkles, hint: "Agent Prompts & Automations" },
];

export function FormulaExplorer({ posts, dictionary }: FormulaExplorerProps) {
  const [activeCat, setActiveCat] = useState("all");
  const [search, setSearch] = useState("");

  const filteredPosts = posts.filter((post) => {
    const title = (post.frontmatter.title || "").toLowerCase();
    const desc = (post.frontmatter.description || "").toLowerCase();
    const tags = (post.frontmatter.tags || []).map((t) => t.toLowerCase());

    const matchesSearch =
      !search ||
      title.includes(search.toLowerCase()) ||
      desc.includes(search.toLowerCase()) ||
      tags.some((t) => t.includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeCat === "lookup") {
      return (
        title.includes("xlookup") ||
        title.includes("vlookup") ||
        title.includes("index") ||
        title.includes("match") ||
        tags.includes("lookup")
      );
    }
    if (activeCat === "arrays") {
      return (
        title.includes("array") ||
        title.includes("filter") ||
        title.includes("sort") ||
        title.includes("unique") ||
        tags.includes("array") ||
        tags.includes("dynamic-arrays")
      );
    }
    if (activeCat === "excel") {
      return tags.includes("excel") || title.includes("excel");
    }
    if (activeCat === "sheets") {
      return tags.includes("google-sheets") || title.includes("sheets") || title.includes("google sheets");
    }
    if (activeCat === "ai") {
      return tags.includes("ai") || title.includes("copilot") || title.includes("ai");
    }

    return true;
  });

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Search & Category Filter Matrix */}
      <div className="flex flex-col gap-4 p-5 rounded-2xl border border-border/70 bg-card/60 backdrop-blur-xs">
        {/* Search Bar */}
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Quick search formula (e.g. XLOOKUP, ARRAYFORMULA, Copilot, SUMIFS)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
        </div>

        {/* Matrix Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {FORMULA_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-foreground text-background font-semibold shadow-xs"
                    : "bg-background border border-border/80 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Matrix of Formula Cards */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono text-muted-foreground">
            Showing <strong className="text-foreground">{filteredPosts.length}</strong> formula guides
          </span>
          {activeCat !== "all" && (
            <button
              onClick={() => setActiveCat("all")}
              className="text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Reset Filter
            </button>
          )}
        </div>

        {filteredPosts.length === 0 ? (
          <div className="py-16 text-center rounded-xl border border-dashed border-border/70 bg-card/40">
            <p className="text-xs font-mono text-muted-foreground">No formulas match your search or filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredPosts.map((post) => (
              <FormulaCard
                key={post.slug}
                post={post}
                dictionary={dictionary}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
