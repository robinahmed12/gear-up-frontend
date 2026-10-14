'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Loader2, Plus, Trash2 } from 'lucide-react';

import {
  createBlockAction,
  deleteBlockAction,
  listBlocksAction,
} from '@/app/(dashboardGroup)/_actions/availabilityActions';
import type { AvailabilityBlock } from '@/lib/types';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface AvailabilityBlocksDialogProps {
  gearId: string;
  gearName?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AvailabilityBlocksDialog({
  gearId,
  gearName,
  open,
  onOpenChange,
}: AvailabilityBlocksDialogProps) {
  const [blocks, setBlocks] = useState<AvailabilityBlock[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;

    let active = true;

    listBlocksAction(gearId).then((result) => {
      if (!active) return;
      setBlocks(result.success ? (result.data as AvailabilityBlock[]) : []);
      setError(result.success ? null : result.message ?? 'Failed to load blocks');
    });

    return () => {
      active = false;
    };
  }, [open, gearId, reloadKey]);

  async function addBlock(event: React.FormEvent) {
    event.preventDefault();
    if (!startDate || !endDate) return;

    setSubmitting(true);
    const result = await createBlockAction(gearId, {
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      reason: reason || undefined,
    });
    setSubmitting(false);

    if (result.success) {
      toast.success(result.message);
      setStartDate('');
      setEndDate('');
      setReason('');
      setReloadKey((key) => key + 1);
    } else {
      toast.error(result.message);
    }
  }

  async function removeBlock(blockId: string) {
    const result = await deleteBlockAction(gearId, blockId);
    if (result.success) {
      toast.success(result.message);
      setReloadKey((key) => key + 1);
    } else {
      toast.error(result.message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Blocked dates{gearName ? ` — ${gearName}` : ''}</DialogTitle>
          <DialogDescription>
            Block date ranges to prevent rentals for this gear.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <form onSubmit={addBlock} className="space-y-3 rounded-md border border-border p-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="block-start">Start date</Label>
                <Input
                  id="block-start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="block-end">End date</Label>
                <Input
                  id="block-end"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="block-reason">Reason (optional)</Label>
              <Input
                id="block-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. Under maintenance"
              />
            </div>
            <Button
              type="submit"
              disabled={submitting || !startDate || !endDate}
              className="w-full"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add block
            </Button>
          </form>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Active blocks</p>
            {blocks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No blocks yet.</p>
            ) : (
              <ul className="divide-y divide-border rounded-md border border-border">
                {blocks.map((block) => (
                  <li key={block.id} className="flex items-center justify-between gap-3 p-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {format(new Date(block.startDate), 'MMM d, yyyy')} →{' '}
                        {format(new Date(block.endDate), 'MMM d, yyyy')}
                      </p>
                      {block.reason && (
                        <p className="text-xs text-muted-foreground">{block.reason}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeBlock(block.id)}
                      aria-label="Delete block"
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
