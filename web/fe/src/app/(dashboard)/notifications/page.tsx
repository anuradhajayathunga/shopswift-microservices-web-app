"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Loader2,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  notificationAPI,
  type Notification,
  type NotificationCreate,
  type NotificationUpdate,
} from "@/lib/notifications";

type NotificationFormState = {
  user_id: string;
  message: string;
  type: string;
  status: string;
};

const initialFormState: NotificationFormState = {
  user_id: "",
  message: "",
  type: "email",
  status: "pending",
};

const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "Sent", value: "sent" },
  { label: "Failed", value: "failed" },
];

const typeOptions = [
  { label: "Email", value: "email" },
  { label: "SMS", value: "sms" },
  { label: "Push", value: "push" },
];

const getStatusBadgeStyle = (status: string) => {
  if (status === "sent") {
    return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300";
  }
  if (status === "failed") {
    return "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300";
  }
  return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
};

const validateForm = (form: NotificationFormState, isEditing: boolean) => {
  if (!isEditing && !form.user_id.trim()) {
    return "User ID is required";
  }

  if (!isEditing) {
    const userId = Number(form.user_id);
    if (!Number.isInteger(userId) || userId <= 0) {
      return "User ID must be a positive integer";
    }
  }

  if (!form.message.trim()) {
    return "Message is required";
  }

  if (!form.type.trim()) {
    return "Type is required";
  }

  if (!form.status.trim()) {
    return "Status is required";
  }

  return null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [form, setForm] = useState<NotificationFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingNotificationId, setEditingNotificationId] = useState<
    number | null
  >(null);
  const [deletingNotificationId, setDeletingNotificationId] = useState<
    number | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const isEditing = editingNotificationId !== null;

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const query = searchTerm.trim().toLowerCase();
      const matchesSearch =
        !query ||
        `${notification.id}`.includes(query) ||
        `${notification.user_id}`.includes(query) ||
        notification.message.toLowerCase().includes(query) ||
        notification.type.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || notification.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [notifications, searchTerm, statusFilter]);

  const loadNotifications = useCallback(async () => {
    try {
      const data = await notificationAPI.list();
      setNotifications(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load notifications",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const resetForm = () => {
    setForm(initialFormState);
    setEditingNotificationId(null);
    setShowForm(false);
  };

  const openCreateForm = () => {
    setEditingNotificationId(null);
    setForm(initialFormState);
    setShowForm(true);
  };

  const handleEdit = (notification: Notification) => {
    setEditingNotificationId(notification.id);
    setForm({
      user_id: String(notification.user_id),
      message: notification.message,
      type: notification.type,
      status: notification.status,
    });
    setShowForm(true);
  };

  const handleChange =
    (key: keyof NotificationFormState) =>
    (event: React.ChangeEvent<HTMLInputElement> | string) => {
      const value = typeof event === "string" ? event : event.target.value;
      setForm((prev) => ({ ...prev, [key]: value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validateForm(form, isEditing);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        const payload: NotificationUpdate = {
          message: form.message,
          type: form.type,
          status: form.status,
        };
        await notificationAPI.update(editingNotificationId, payload);
        toast.success("Notification updated successfully");
      } else {
        const payload: NotificationCreate = {
          user_id: Number(form.user_id),
          message: form.message,
          type: form.type,
        };
        await notificationAPI.create(payload);
        toast.success("Notification created successfully");
      }

      resetForm();
      await loadNotifications();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to save notification",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (notification: Notification) => {
    if (
      !window.confirm(
        `Are you sure you want to delete notification #${notification.id}?`,
      )
    ) {
      return;
    }

    setDeletingNotificationId(notification.id);
    try {
      await notificationAPI.delete(notification.id);
      toast.success("Notification deleted successfully");
      await loadNotifications();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to delete notification",
      );
    } finally {
      setDeletingNotificationId(null);
    }
  };

  return (
    <div className="mx-auto space-y-6 pb-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <Breadcrumb className="mb-1.5">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href="/">Dashboard</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Notifications</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, track, and manage all customer notifications from one place.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => loadNotifications()}
            variant="outline"
            size="sm"
            className="h-9 gap-2 shadow-sm"
          >
            <RefreshCw className="size-4" />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
          <Button onClick={openCreateForm} size="sm" className="h-9 gap-2">
            <Plus className="size-4" />
            New Notification
          </Button>
        </div>
      </div>

      <Dialog
        open={showForm}
        onOpenChange={(open) => {
          if (!open) {
            resetForm();
            return;
          }
          setShowForm(open);
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Notification" : "Create New Notification"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the message type and delivery status."
                : "Create and send a new notification to a user."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user_id">User ID</Label>
                <Input
                  id="user_id"
                  type="number"
                  min="1"
                  value={form.user_id}
                  onChange={handleChange("user_id")}
                  placeholder="e.g. 1"
                  disabled={isSubmitting || isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) => handleChange("type")(value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Input
                id="message"
                value={form.message}
                onChange={handleChange("message")}
                placeholder="Type the notification message"
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => handleChange("status")(value)}
                disabled={isSubmitting}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : isEditing ? (
                  "Update Notification"
                ) : (
                  "Create Notification"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="border-border bg-background shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border/50 bg-muted/10 flex flex-col md:flex-row gap-3 md:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID, user, message, or type..."
              className="pl-9 h-9"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px] h-9">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-xs text-muted-foreground md:ml-auto">
            {filteredNotifications.length} of {notifications.length}{" "}
            notifications
          </div>
        </div>

        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="size-8 animate-spin text-primary/60 mb-4" />
              <p className="text-sm">Loading notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Bell className="size-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                No notifications found
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm mb-6">
                Start by creating your first notification to keep users
                informed.
              </p>
              <Button onClick={openCreateForm} variant="outline">
                <Plus className="size-4 mr-2" />
                Create First Notification
              </Button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <p className="text-sm text-muted-foreground">
                No notifications match your filters
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/10">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-semibold">ID</TableHead>
                    <TableHead className="font-semibold">User ID</TableHead>
                    <TableHead className="font-semibold">Message</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created At</TableHead>
                    <TableHead className="font-semibold text-right w-[100px]">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredNotifications.map((notification) => (
                    <TableRow
                      key={notification.id}
                      className="group hover:bg-muted/40 transition-colors"
                    >
                      <TableCell className="font-medium">
                        #{notification.id}
                      </TableCell>
                      <TableCell>{notification.user_id}</TableCell>
                      <TableCell className="max-w-[360px] truncate">
                        {notification.message}
                      </TableCell>
                      <TableCell className="uppercase text-xs font-medium text-muted-foreground">
                        {notification.type}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`${getStatusBadgeStyle(notification.status)} shadow-none border-0`}
                        >
                          {notification.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(notification.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 hover:bg-primary/10 hover:text-primary"
                            onClick={() => handleEdit(notification)}
                            disabled={
                              isSubmitting ||
                              deletingNotificationId === notification.id
                            }
                            title="Edit Notification"
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            type="button"
                            size="icon"
                            variant="ghost"
                            className="size-8 hover:bg-destructive/10 hover:text-destructive"
                            onClick={() => handleDelete(notification)}
                            disabled={
                              isSubmitting ||
                              deletingNotificationId === notification.id
                            }
                            title="Delete Notification"
                          >
                            {deletingNotificationId === notification.id ? (
                              <Loader2 className="size-4 animate-spin" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
