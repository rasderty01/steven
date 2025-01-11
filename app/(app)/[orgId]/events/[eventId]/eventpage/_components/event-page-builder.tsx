import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/utils/supabase/client";
import { usePermissions } from "@/components/hooks/usePermissions";
import { Editor, Frame, Element, useNode } from "@craftjs/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Eye, Save } from "lucide-react";

const supabase = createClient();

// Basic components for the page builder
interface BackgroundImageProps {
  background: string;
  children: React.ReactNode;
}

const BackgroundImage = ({ background, children }: BackgroundImageProps) => {
  return (
    <div
      className="w-full min-h-[400px] bg-cover bg-center relative"
      style={{ backgroundImage: `url(${background})` }}
    >
      {children}
    </div>
  );
};

interface LogoProps {
  src: string;
  size?: number;
}

const Logo = ({ src, size = 100 }: LogoProps) => {
  return (
    <img
      src={src || "/api/placeholder/200/200"}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
      alt="Event logo"
    />
  );
};

interface TextBlockProps {
  text: string;
  fontSize?: number;
  color?: string;
}

const TextBlock = ({
  text,
  fontSize = 16,
  color = "#000000",
}: TextBlockProps) => {
  return <p style={{ fontSize: `${fontSize}px`, color }}>{text}</p>;
};

// Register components as user components
BackgroundImage.craft = {
  props: {
    background: "",
  },
  related: {
    settings: BackgroundSettings,
  },
};

Logo.craft = {
  props: {
    src: "",
    size: 100,
  },
  related: {
    settings: LogoSettings,
  },
};

TextBlock.craft = {
  props: {
    text: "Edit this text",
    fontSize: 16,
    color: "#000000",
  },
  related: {
    settings: TextSettings,
  },
};

// Settings components
function BackgroundSettings() {
  const { actions, background } = useNode((node) => ({
    background: node.data.props.background,
  }));

  return (
    <div className="space-y-4">
      <Label>Background Image URL</Label>
      <Input
        type="text"
        value={background}
        onChange={(e) =>
          actions.setProp((props: any) => (props.background = e.target.value))
        }
        placeholder="Enter image URL"
      />
    </div>
  );
}

function LogoSettings() {
  const { actions, src, size } = useNode((node) => ({
    src: node.data.props.src,
    size: node.data.props.size,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Logo URL</Label>
        <Input
          type="text"
          value={src}
          onChange={(e) =>
            actions.setProp((props: any) => (props.src = e.target.value))
          }
          placeholder="Enter logo URL"
        />
      </div>
      <div>
        <Label>Size (px)</Label>
        <Input
          type="number"
          value={size}
          onChange={(e) =>
            actions.setProp(
              (props: any) => (props.size = parseInt(e.target.value))
            )
          }
          min={50}
          max={300}
        />
      </div>
    </div>
  );
}

function TextSettings() {
  const { actions, text, fontSize, color } = useNode((node) => ({
    text: node.data.props.text,
    fontSize: node.data.props.fontSize,
    color: node.data.props.color,
  }));

  return (
    <div className="space-y-4">
      <div>
        <Label>Text Content</Label>
        <Input
          type="text"
          value={text}
          onChange={(e) =>
            actions.setProp((props: any) => (props.text = e.target.value))
          }
        />
      </div>
      <div>
        <Label>Font Size (px)</Label>
        <Input
          type="number"
          value={fontSize}
          onChange={(e) =>
            actions.setProp(
              (props: any) => (props.fontSize = parseInt(e.target.value))
            )
          }
          min={12}
          max={72}
        />
      </div>
      <div>
        <Label>Color</Label>
        <Input
          type="color"
          value={color}
          onChange={(e) =>
            actions.setProp((props: any) => (props.color = e.target.value))
          }
        />
      </div>
    </div>
  );
}

const EventPageBuilder = () => {
  const params = useParams();
  const queryClient = useQueryClient();
  const { hasEventPermission } = usePermissions();
  const canEdit = hasEventPermission("EDIT");
  const [previewMode, setPreviewMode] = useState(false);

  // Fetch event data
  const { data: event, isLoading } = useQuery({
    queryKey: ["event", params.eventId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("Event")
        .select("*")
        .eq("id", params.eventId as string)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update event mutation
  const { mutate: updateEvent, isPending } = useMutation({
    mutationFn: async (values: any) => {
      const { error } = await supabase
        .from("Event")
        .update(values)
        .eq("id", params.eventId as string);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["event", params.eventId] });
    },
  });

  const handlePublish = (json: any) => {
    updateEvent({
      publish: true,
      styling: json,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleSaveDraft = (json: any) => {
    updateEvent({
      styling: json,
      updatedAt: new Date().toISOString(),
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">Loading...</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Event Page Builder</h1>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>

          {canEdit && (
            <>
              <Button
                variant="outline"
                onClick={() => handleSaveDraft(event?.styling)}
                disabled={isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>

              <Button
                variant="default"
                onClick={() => handlePublish(event?.styling)}
                disabled={isPending}
              >
                <Globe className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </>
          )}
        </div>
      </div>

      {event?.publish && (
        <Alert className="mb-6">
          <Globe className="h-4 w-4" />
          <AlertDescription>
            Your event is published at:{" "}
            <a
              href={`/e/rsvp/${event.eventCode}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline"
            >
              {`/e/rsvp/${event.eventCode}`}
            </a>
          </AlertDescription>
        </Alert>
      )}

      <Editor enabled={!previewMode && canEdit} onRender={RenderNode}>
        <Frame>
          <Element
            canvas
            is={BackgroundImage}
            background={event?.styling?.background || ""}
          >
            <Element canvas is={Logo} src={event?.styling?.logo || ""} />
            <Element canvas is={TextBlock} text={event?.title} fontSize={32} />
            <Element
              canvas
              is={TextBlock}
              text={event?.description}
              fontSize={16}
            />
          </Element>
        </Frame>
      </Editor>
    </div>
  );
};

export default EventPageBuilder;
