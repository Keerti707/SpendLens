"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AuditForm() {
  return (
    <Card className="mt-20 w-full max-w-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>AI Tool</Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select a tool" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="chatgpt">ChatGPT</SelectItem>
              <SelectItem value="claude">Claude</SelectItem>
              <SelectItem value="cursor">Cursor</SelectItem>
              <SelectItem value="copilot">GitHub Copilot</SelectItem>
              <SelectItem value="gemini">Gemini</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Monthly Spend ($)</Label>
          <Input placeholder="200" type="number" />
        </div>

        <div className="space-y-2">
          <Label>Team Size</Label>
          <Input placeholder="5" type="number" />
        </div>

        <div className="space-y-2">
          <Label>Primary Use Case</Label>

          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="coding">Coding</SelectItem>
              <SelectItem value="writing">Writing</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <button className="mt-8 w-full rounded-xl bg-white px-6 py-3 font-medium text-black transition hover:bg-white/90">
        Generate Audit
      </button>
    </Card>
  );
}