"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";

interface Project {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  color: string;
  github?: string;
  live?: string; // si quieres usar el botón original para el sitio en vivo
}

interface ProjectCardProps {
  project: Project;
  isDark: boolean;
}

export function ProjectCard({ project, isDark }: ProjectCardProps) {
  return (
    <Card
      className={`transition-all duration-500 transform hover:scale-105 hover:rotate-1 group backdrop-blur-sm ${
        isDark
          ? "bg-gray-900/50 border-gray-700 hover:border-purple-500/50"
          : "bg-white/50 border-gray-200 hover:border-purple-400/50 shadow-lg hover:shadow-xl"
      }`}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-20 group-hover:opacity-40 transition-opacity duration-300`}
          />
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="secondary"
                  className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <Github className="w-4 h-4" />
                </Button>
              </a>
            )}
          </div>
        </div>

        <div className="p-6">
          <h3
            className={`text-xl font-bold mb-3 transition-colors duration-300 ${
              isDark ? "text-white group-hover:text-purple-400" : "text-gray-900 group-hover:text-purple-600"
            }`}
          >
            {project.title}
          </h3>
          <p className={`mb-4 leading-relaxed ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag, tagIndex) => (
              <Badge
                key={tagIndex}
                variant="secondary"
                className={`transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-800 text-purple-400 hover:bg-purple-500 hover:text-white"
                    : "bg-gray-100 text-purple-600 hover:bg-purple-500 hover:text-white"
                }`}
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
