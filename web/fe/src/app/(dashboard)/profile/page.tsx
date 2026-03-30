"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Save, UserRound, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authAPI } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ProfileState = {
  id: number | null;
  email: string;
  name: string;
};

const initialProfileState: ProfileState = {
  id: null,
  email: "",
  name: "",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>(initialProfileState);
  const [nameInput, setNameInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadProfile = useCallback(async () => {
    try {
      const cachedProfile = authAPI.getUser();
      if (!cachedProfile?.email) {
        toast.error("No signed-in user found. Please sign in again.");
        return;
      }

      const fullProfile = await authAPI.getUserByEmail(cachedProfile.email);
      const mergedProfile: ProfileState = {
        id: fullProfile.id ?? null,
        email: fullProfile.email ?? cachedProfile.email,
        name: fullProfile.name ?? "",
      };

      setProfile(mergedProfile);
      setNameInput(mergedProfile.name);
      authAPI.saveUser(fullProfile);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = nameInput.trim();
    if (!trimmedName) {
      toast.error("Name is required");
      return;
    }

    if (!profile.id) {
      toast.error("Unable to identify user profile");
      return;
    }

    setIsSaving(true);
    try {
      const updatedProfile = await authAPI.updateUser(profile.id, {
        name: trimmedName,
      });

      const nextProfile: ProfileState = {
        id: updatedProfile.id ?? profile.id,
        email: updatedProfile.email ?? profile.email,
        name: updatedProfile.name ?? trimmedName,
      };

      setProfile(nextProfile);
      setNameInput(nextProfile.name);
      authAPI.saveUser(updatedProfile);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const hasNameChanged = nameInput.trim() !== profile.name.trim();

  // Helper to extract initials for the Avatar
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-500 max-w-5xl ">
      
      {/* Page Header */}
      <div className="flex flex-col gap-1.5">
        <Breadcrumb className="mb-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground transition-colors">
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild className="text-muted-foreground hover:text-foreground transition-colors">
                <Link href="/settings">Settings</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">Profile</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Profile Settings
        </h1>
        <p className="text-sm text-muted-foreground">
          Manage your account identity and personal information.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-border/60 rounded-xl bg-card">
          <Loader2 className="size-6 animate-spin text-primary/60 mb-4" />
          <p className="text-sm">Loading your profile data...</p>
        </div>
      ) : (
        <Card className="border-border/60 shadow-sm overflow-hidden rounded-xl">
          <form onSubmit={handleSubmit}>
            
            <CardHeader className="border-b border-border/60 bg-muted/10 px-6 py-5">
              <CardTitle className="text-lg flex items-center gap-2">
                <UserRound className="size-5 text-primary" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your display name and view your primary email address.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 sm:p-8 space-y-8">
              
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <Avatar className="size-20 border-2 border-border/50 shadow-sm">
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-medium">
                    {getInitials(nameInput || profile.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <h3 className="font-medium text-foreground">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground max-w-sm">
                    Your avatar is automatically generated from your initials. Custom image uploads are coming soon.
                  </p>
                </div>
              </div>

              <div className="h-px bg-border/50 w-full" />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Name Field */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="profile-name" className="text-sm font-medium text-foreground">
                      Display Name
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      Please enter your full name, or a display name you are comfortable with.
                    </p>
                  </div>
                  <Input
                    id="profile-name"
                    value={nameInput}
                    onChange={(event) => setNameInput(event.target.value)}
                    placeholder="Enter your full name"
                    disabled={isSaving}
                    className="max-w-md shadow-sm bg-background transition-colors focus-visible:ring-1"
                  />
                </div>

                {/* Email Field (Read-only) */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="profile-email" className="text-sm font-medium text-foreground flex items-center gap-2">
                      Email Address
                      <ShieldCheck className="size-3.5 text-emerald-500" />
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      The email associated with your account. Contact support to change this.
                    </p>
                  </div>
                  <div className="relative max-w-md">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/70" />
                    <Input
                      id="profile-email"
                      value={profile.email}
                      disabled
                      className="pl-9 bg-muted/40 text-muted-foreground shadow-none border-border/60 cursor-not-allowed"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                  </div>
                </div>

              </div>
            </CardContent>

            {/* Action Footer */}
            <CardFooter className="px-6 py-4 bg-muted/20 border-t border-border/60 flex items-center justify-between sm:justify-end gap-3">
              <span className="text-xs text-muted-foreground hidden sm:inline-block mr-2">
                {hasNameChanged ? "Unsaved changes" : "Your profile is up to date"}
              </span>
              <Button
                type="button"
                variant="outline"
                className="bg-background shadow-sm"
                onClick={() => setNameInput(profile.name)}
                disabled={!hasNameChanged || isSaving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="min-w-[130px] shadow-sm"
                disabled={isSaving || !hasNameChanged}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="size-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="size-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>

          </form>
        </Card>
      )}
    </div>
  );
}