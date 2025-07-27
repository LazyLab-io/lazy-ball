"use client";

import type React from "react";
import { useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gamepad2, Users, Keyboard, Trophy } from "lucide-react";

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Paddle {
  y: number;
  score: number;
}

export default function PongLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("Canvas element not found");
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("Failed to get 2D context");
      return;
    }

    // Set canvas dimensions
    canvas.width = 400;
    canvas.height = 300;

    // Game state
    const ball: Ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: 3,
      dy: 2,
    };

    const leftPaddle: Paddle = {
      y: canvas.height / 2 - 40,
      score: 0,
    };

    const rightPaddle: Paddle = {
      y: canvas.height / 2 - 40,
      score: 0,
    };

    const paddleWidth = 8;
    const paddleHeight = 80;
    const ballSize = 8;

    // Drawing functions with explicit ctx parameter to avoid linter issues
    const drawRect = (
      x: number,
      y: number,
      width: number,
      height: number,
      color: string,
    ) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, width, height);
    };

    const drawBall = (x: number, y: number, size: number, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawNet = () => {
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.strokeStyle = "#374151";
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const updatePaddles = () => {
      const paddleSpeed = 2;

      if (leftPaddle.y + paddleHeight / 2 < ball.y - 10) {
        leftPaddle.y += paddleSpeed;
      } else if (leftPaddle.y + paddleHeight / 2 > ball.y + 10) {
        leftPaddle.y -= paddleSpeed;
      }

      if (rightPaddle.y + paddleHeight / 2 < ball.y - 10) {
        rightPaddle.y += paddleSpeed;
      } else if (rightPaddle.y + paddleHeight / 2 > ball.y + 10) {
        rightPaddle.y -= paddleSpeed;
      }

      leftPaddle.y = Math.max(
        0,
        Math.min(canvas.height - paddleHeight, leftPaddle.y),
      );
      rightPaddle.y = Math.max(
        0,
        Math.min(canvas.height - paddleHeight, rightPaddle.y),
      );
    };

    const updateBall = () => {
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y <= ballSize || ball.y >= canvas.height - ballSize) {
        ball.dy = -ball.dy;
      }

      if (
        ball.x <= paddleWidth + ballSize &&
        ball.y >= leftPaddle.y &&
        ball.y <= leftPaddle.y + paddleHeight
      ) {
        ball.dx = -ball.dx;
        ball.x = paddleWidth + ballSize;
      }

      if (
        ball.x >= canvas.width - paddleWidth - ballSize &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + paddleHeight
      ) {
        ball.dx = -ball.dx;
        ball.x = canvas.width - paddleWidth - ballSize;
      }

      if (ball.x < 0 || ball.x > canvas.width) {
        ball.x = canvas.width / 2;
        ball.y = canvas.height / 2;
        ball.dx = -ball.dx;
      }
    };

    const draw = () => {
      drawRect(0, 0, canvas.width, canvas.height, "#111827");
      drawNet();
      drawRect(0, leftPaddle.y, paddleWidth, paddleHeight, "#8b5cf6");
      drawRect(
        canvas.width - paddleWidth,
        rightPaddle.y,
        paddleWidth,
        paddleHeight,
        "#6366f1",
      );
      drawBall(ball.x, ball.y, ballSize, "#f59e0b");
    };

    const gameLoop = () => {
      updatePaddles();
      updateBall();
      draw();
      animationRef.current = requestAnimationFrame(gameLoop);
    };

    // Start the game loop
    gameLoop();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // JSX remains unchanged
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-violet-400" />
            <span className="text-2xl font-bold text-white">LazyBall</span>
          </div>
          <Badge
            variant="secondary"
            className="bg-violet-500/20 text-violet-400 border-violet-500/30"
          >
            Coming Soon
          </Badge>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                The Ultimate
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">
                  {" "}
                  Pong{" "}
                </span>
                Experience
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                Get ready for the most advanced pong game ever created.
                Featuring split keyboard controls, real-time multiplayer,
                comprehensive stats tracking, and much more.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={300}
                className="border border-gray-700 rounded-lg shadow-2xl"
              />
              <div className="absolute -top-4 -right-4 bg-violet-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Live Demo
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Upcoming Features
          </h2>
          <p className="text-gray-400 text-lg">
            Everything you need for the perfect pong experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <Keyboard className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Split Keyboard
                </h3>
              </div>
              <p className="text-gray-400">
                Play with a friend on the same keyboard. Customizable key
                bindings for both players.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Multiplayer
                </h3>
              </div>
              <p className="text-gray-400">
                Challenge players from around the world with real-time online
                multiplayer matches.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">
                  Tournaments
                </h3>
              </div>
              <p className="text-gray-400">
                Compete in organized tournaments and climb the global
                leaderboards.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl text-center font-bold text-white">
          Stay tuned. Coming soon.
        </h2>
      </section>

      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Gamepad2 className="h-6 w-6 text-violet-400" />
            <span className="text-xl font-bold text-white">LazyBall</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2025 LazyLab.io. Coming soon to revolutionize classic gaming.
          </p>
        </div>
      </footer>
    </div>
  );
}
