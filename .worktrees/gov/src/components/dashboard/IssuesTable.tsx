"use client";

import { useState, useMemo } from "react";
import { Issue, IssueCategory, SeverityLevel, IssueStatus } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Search,
  ArrowUpDown,
  Eye,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/shared/GlassCard";

interface IssuesTableProps {
  issues: Issue[];
}

type SortKey = keyof Issue | "daysOpen";

const CATEGORIES: IssueCategory[] = [
  "Pothole",
  "Garbage",
  "Water Leak",
  "Broken Streetlight",
  "Drainage Issue",
  "Graffiti",
  "Broken Sidewalk",
  "Fallen Tree",
  "Public Safety Hazard",
  "Traffic Signal Failure",
  "Other",
];

const SEVERITIES: SeverityLevel[] = ["Low", "Medium", "High", "Critical"];
const STATUSES: IssueStatus[] = [
  "Submitted",
  "AI_Processing",
  "Validated",
  "Routed",
  "Assigned",
  "In_Progress",
  "Resolved",
  "Verified",
  "Escalated",
];

const DEPARTMENTS = [
  "Public Works",
  "Sanitation Dept",
  "Water Board",
  "Electrical Dept",
  "Drainage Board",
  "Traffic Police",
  "Parks & Gardens",
];

function getDaysOpen(issue: Issue): number {
  const now = new Date();
  const created = new Date(issue.createdAt);
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

export function IssuesTable({ issues }: IssuesTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let data = [...issues];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter(
        (i) =>
          i.id.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "all") data = data.filter((i) => i.category === categoryFilter);
    if (severityFilter !== "all") data = data.filter((i) => i.severity === severityFilter);
    if (statusFilter !== "all") data = data.filter((i) => i.status === statusFilter);
    if (departmentFilter !== "all") data = data.filter((i) => i.department === departmentFilter);

    data.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      if (sortKey === "daysOpen") {
        aVal = getDaysOpen(a);
        bVal = getDaysOpen(b);
      } else {
        aVal = a[sortKey];
        bVal = b[sortKey];
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (aVal instanceof Date && bVal instanceof Date) {
        return sortOrder === "asc" ? aVal.getTime() - bVal.getTime() : bVal.getTime() - aVal.getTime();
      }
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });

    return data;
  }, [issues, search, categoryFilter, severityFilter, statusFilter, departmentFilter, sortKey, sortOrder]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder((o) => (o === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  }

  return (
    <GlassCard className="p-0 overflow-hidden">
      <div className="p-4 border-b border-border/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v || "all")}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v || "all")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                {SEVERITIES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.replace("_", " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={(v) => setDepartmentFilter(v || "all")}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {DEPARTMENTS.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[90px]">
                <button onClick={() => toggleSort("id")} className="flex items-center gap-1 hover:text-foreground/80">
                  ID <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("category")} className="flex items-center gap-1 hover:text-foreground/80">
                  Category <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("severity")} className="flex items-center gap-1 hover:text-foreground/80">
                  Severity <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>Location</TableHead>
              <TableHead>
                <button onClick={() => toggleSort("department")} className="flex items-center gap-1 hover:text-foreground/80">
                  Department <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("daysOpen")} className="flex items-center gap-1 hover:text-foreground/80">
                  Days Open <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead>
                <button onClick={() => toggleSort("status")} className="flex items-center gap-1 hover:text-foreground/80">
                  Status <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No issues found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((issue, idx) => (
                <motion.tr
                  key={issue.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  className="border-b transition-colors hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{issue.id}</TableCell>
                  <TableCell>{issue.category}</TableCell>
                  <TableCell>
                    <StatusBadge severity={issue.severity} size="sm" />
                  </TableCell>
                  <TableCell className="max-w-[180px] truncate" title={issue.location.address}>
                    {issue.location.address}
                  </TableCell>
                  <TableCell>{issue.department}</TableCell>
                  <TableCell>{getDaysOpen(issue)}</TableCell>
                  <TableCell>
                    <StatusBadge status={issue.status} size="sm" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon-xs" title="View">
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" title="Assign">
                        <UserPlus className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon-xs" title="Escalate">
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="px-4 py-3 border-t border-border/50 text-sm text-muted-foreground">
        Showing {filtered.length} of {issues.length} issues
      </div>
    </GlassCard>
  );
}
