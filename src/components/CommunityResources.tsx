import { useState } from "react";
import { Users, Phone, BookOpen, Heart, MapPin, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Resource {
  title: string;
  description: string;
  link: string;
  phone?: string;
  severity?: string[];
  type: "support" | "therapy" | "education" | "crisis";
}

const resources: Resource[] = [
  // Support Groups
  {
    title: "Autism Society Support Groups",
    description: "Local and online support groups for families and individuals with autism",
    link: "https://www.autism-society.org/local-affiliates/",
    type: "support",
    severity: ["low", "mild", "moderate", "high"],
  },
  {
    title: "Autism Speaks Community",
    description: "Connect with other families and share experiences",
    link: "https://www.autismspeaks.org/autism-support-groups",
    type: "support",
    severity: ["low", "mild", "moderate", "high"],
  },
  
  // Therapy Services
  {
    title: "Applied Behavior Analysis (ABA) Providers",
    description: "Find certified ABA therapists in your area",
    link: "https://www.bacb.com/services/o.php?page=101155",
    type: "therapy",
    severity: ["mild", "moderate", "high"],
  },
  {
    title: "Occupational Therapy Directory",
    description: "Locate occupational therapists specializing in autism",
    link: "https://www.aota.org/",
    type: "therapy",
    severity: ["low", "mild", "moderate", "high"],
  },
  {
    title: "Speech-Language Pathology Services",
    description: "Find speech therapists experienced with autism",
    link: "https://www.asha.org/profind/",
    type: "therapy",
    severity: ["mild", "moderate", "high"],
  },
  
  // Educational Resources
  {
    title: "Autism Navigator",
    description: "Evidence-based resources and online courses for parents",
    link: "https://autismnavigator.com/",
    type: "education",
    severity: ["low", "mild", "moderate", "high"],
  },
  {
    title: "National Autism Center",
    description: "Evidence-based practice guides and educational materials",
    link: "https://www.nationalautismcenter.org/",
    type: "education",
    severity: ["low", "mild", "moderate", "high"],
  },
  {
    title: "Organization for Autism Research",
    description: "Research-based information and practical resources",
    link: "https://researchautism.org/",
    type: "education",
    severity: ["low", "mild", "moderate"],
  },
  
  // Crisis Resources
  {
    title: "988 Suicide & Crisis Lifeline",
    description: "24/7 crisis support by phone, text, or chat",
    link: "https://988lifeline.org/",
    phone: "988",
    type: "crisis",
    severity: ["high"],
  },
  {
    title: "Crisis Text Line",
    description: "Free 24/7 crisis support via text message",
    link: "https://www.crisistextline.org/",
    phone: "Text HOME to 741741",
    type: "crisis",
    severity: ["moderate", "high"],
  },
  {
    title: "Autism Society Crisis Intervention",
    description: "Specialized crisis support for autism-related emergencies",
    link: "https://www.autism-society.org/living-with-autism/autism-and-crisis/",
    phone: "1-800-3-AUTISM (1-800-328-8476)",
    type: "crisis",
    severity: ["moderate", "high"],
  },
  {
    title: "NAMI Helpline",
    description: "Mental health support and resource referrals",
    link: "https://www.nami.org/help",
    phone: "1-800-950-NAMI (6264)",
    type: "crisis",
    severity: ["moderate", "high"],
  },
];

export const CommunityResources = ({ severity = "mild" }: { severity?: string }) => {
  const [location, setLocation] = useState("");

  const getFilteredResources = (type: string) => {
    return resources.filter(
      (r) => r.type === type && (!r.severity || r.severity.includes(severity))
    );
  };

  const ResourceCard = ({ resource }: { resource: Resource }) => (
    <div className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold text-foreground">{resource.title}</h4>
        <Badge variant="outline" className="text-xs">
          {resource.type}
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{resource.description}</p>
      <div className="flex flex-col gap-2">
        {resource.phone && (
          <a
            href={`tel:${resource.phone}`}
            className="flex items-center gap-2 text-sm text-primary hover:underline"
          >
            <Phone className="h-4 w-4" />
            {resource.phone}
          </a>
        )}
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Visit Website
        </a>
      </div>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Community Resources
        </CardTitle>
        <CardDescription>
          Access support groups, therapy services, educational resources, and crisis support
        </CardDescription>
        <div className="mt-4">
          <Label htmlFor="location" className="flex items-center gap-2 mb-2">
            <MapPin className="h-4 w-4" />
            Your Location (Optional)
          </Label>
          <Input
            id="location"
            placeholder="Enter city, state, or zip code"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Help us find resources near you
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="support" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="support">
              <Users className="h-4 w-4 mr-2" />
              Support
            </TabsTrigger>
            <TabsTrigger value="therapy">
              <Heart className="h-4 w-4 mr-2" />
              Therapy
            </TabsTrigger>
            <TabsTrigger value="education">
              <BookOpen className="h-4 w-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="crisis">
              <Phone className="h-4 w-4 mr-2" />
              Crisis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="support" className="space-y-3 mt-4">
            {getFilteredResources("support").map((resource, idx) => (
              <ResourceCard key={idx} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="therapy" className="space-y-3 mt-4">
            {getFilteredResources("therapy").map((resource, idx) => (
              <ResourceCard key={idx} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="education" className="space-y-3 mt-4">
            {getFilteredResources("education").map((resource, idx) => (
              <ResourceCard key={idx} resource={resource} />
            ))}
          </TabsContent>

          <TabsContent value="crisis" className="space-y-3 mt-4">
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-destructive mb-1">Emergency Support</p>
              <p className="text-sm text-foreground">
                If you or someone you know is in immediate danger, call 911 or go to the nearest emergency room.
              </p>
            </div>
            {getFilteredResources("crisis").map((resource, idx) => (
              <ResourceCard key={idx} resource={resource} />
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
