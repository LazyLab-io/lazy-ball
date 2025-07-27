"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gamepad2, Users, Keyboard, Zap, Trophy } from "lucide-react"

interface Ball {
  x: number
  y: number
  dx: number
  dy: number
}

interface Paddle {
  y: number
  score: number
}

export default function PongLanding() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [email, setEmail] = useState("")

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Game state
    const ball: Ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: 3,
      dy: 2,
    }

    const leftPaddle: Paddle = {
      y: canvas.height / 2 - 40,
      score: 0,
    }

    const rightPaddle: Paddle = {
      y: canvas.height / 2 - 40,
      score: 0,
    }

    const paddleWidth = 8
    const paddleHeight = 80
    const ballSize = 8

    function drawRect(x: number, y: number, width: number, height: number, color: string) {
      ctx!.fillStyle = color
      ctx!.fillRect(x, y, width, height)
    }

    function drawBall(x: number, y: number, size: number, color: string) {
      ctx!.fillStyle = color
      ctx!.beginPath()
      ctx!.arc(x, y, size, 0, Math.PI * 2)
      ctx!.fill()
    }

    function drawNet() {
      ctx!.setLineDash([5, 15])
      ctx!.beginPath()
      ctx!.moveTo(canvas.width / 2, 0)
      ctx!.lineTo(canvas.width / 2, canvas.height)
      ctx!.strokeStyle = "#374151"
      ctx!.stroke()
      ctx!.setLineDash([])
    }

    function updatePaddles() {
      // Simple AI for paddles
      const paddleSpeed = 2

      // Left paddle follows ball
      if (leftPaddle.y + paddleHeight / 2 < ball.y - 10) {
        leftPaddle.y += paddleSpeed
      } else if (leftPaddle.y + paddleHeight / 2 > ball.y + 10) {
        leftPaddle.y -= paddleSpeed
      }

      // Right paddle follows ball
      if (rightPaddle.y + paddleHeight / 2 < ball.y - 10) {
        rightPaddle.y += paddleSpeed
      } else if (rightPaddle.y + paddleHeight / 2 > ball.y + 10) {
        rightPaddle.y -= paddleSpeed
      }

      // Keep paddles in bounds
      leftPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, leftPaddle.y))
      rightPaddle.y = Math.max(0, Math.min(canvas.height - paddleHeight, rightPaddle.y))
    }

    function updateBall() {
      ball.x += ball.dx
      ball.y += ball.dy

      // Ball collision with top and bottom walls
      if (ball.y <= ballSize || ball.y >= canvas.height - ballSize) {
        ball.dy = -ball.dy
      }

      // Ball collision with paddles
      if (ball.x <= paddleWidth + ballSize && ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + paddleHeight) {
        ball.dx = -ball.dx
        ball.x = paddleWidth + ballSize
      }

      if (
        ball.x >= canvas.width - paddleWidth - ballSize &&
        ball.y >= rightPaddle.y &&
        ball.y <= rightPaddle.y + paddleHeight
      ) {
        ball.dx = -ball.dx
        ball.x = canvas.width - paddleWidth - ballSize
      }

      // Reset ball if it goes out of bounds
      if (ball.x < 0 || ball.x > canvas.width) {
        ball.x = canvas.width / 2
        ball.y = canvas.height / 2
        ball.dx = -ball.dx
      }
    }

    function draw() {
      // Clear canvas
      drawRect(0, 0, canvas.width, canvas.height, "#111827")

      // Draw net
      drawNet()

      // Draw paddles
      drawRect(0, leftPaddle.y, paddleWidth, paddleHeight, "#8b5cf6")
      drawRect(canvas.width - paddleWidth, rightPaddle.y, paddleWidth, paddleHeight, "#6366f1")

      // Draw ball
      drawBall(ball.x, ball.y, ballSize, "#f59e0b")
    }

    function gameLoop() {
      updatePaddles()
      updateBall()
      draw()
      animationRef.current = requestAnimationFrame(gameLoop)
    }

    // Start the game loop
    gameLoop()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle email submission here
    console.log("Email submitted:", email)
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Gamepad2 className="h-8 w-8 text-violet-400" />
            <span className="text-2xl font-bold text-white">LazyBall</span>
          </div>
          <Badge variant="secondary" className="bg-violet-500/20 text-violet-400 border-violet-500/30">
            Coming Soon
          </Badge>
        </div>
      </header>

      {/* Hero Section */}
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
                Get ready for the most advanced pong game ever created. Featuring split keyboard controls, real-time
                multiplayer, comprehensive stats tracking, and much more.
              </p>
            </div>

            {/*<div className="flex flex-wrap gap-3">*/}
            {/*  <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30 px-3 py-1">*/}
            {/*    <Keyboard className="w-4 h-4 mr-2" />*/}
            {/*    Split Keyboard*/}
            {/*  </Badge>*/}
            {/*  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-3 py-1">*/}
            {/*    <Users className="w-4 h-4 mr-2" />*/}
            {/*    Multiplayer*/}
            {/*  </Badge>*/}
            {/*  <Badge className="bg-indigo-500/20 text-indigo-400 border-indigo-500/30 px-3 py-1">*/}
            {/*    <Users className="w-4 h-4 mr-2" />*/}
            {/*    Tournament*/}
            {/*  </Badge>*/}
            {/*</div>*/}

            {/*<form onSubmit={handleEmailSubmit} className="flex gap-3 max-w-md">*/}
            {/*  <Input*/}
            {/*    type="email"*/}
            {/*    placeholder="Enter your email for updates"*/}
            {/*    value={email}*/}
            {/*    onChange={(e) => setEmail(e.target.value)}*/}
            {/*    className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"*/}
            {/*    required*/}
            {/*  />*/}
            {/*  <Button type="submit" className="bg-violet-600 hover:bg-violet-700 text-white">*/}
            {/*    Notify Me*/}
            {/*  </Button>*/}
            {/*</form>*/}
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

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Upcoming Features</h2>
          <p className="text-gray-400 text-lg">Everything you need for the perfect pong experience</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-violet-500/20 rounded-lg">
                  <Keyboard className="h-6 w-6 text-violet-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Split Keyboard</h3>
              </div>
              <p className="text-gray-400">
                Play with a friend on the same keyboard. Customizable key bindings for both players.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Users className="h-6 w-6 text-indigo-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Multiplayer</h3>
              </div>
              <p className="text-gray-400">
                Challenge players from around the world with real-time online multiplayer matches.
              </p>
            </CardContent>
          </Card>

          {/*<Card className="bg-gray-800 border-gray-700">*/}
          {/*  <CardContent className="p-6">*/}
          {/*    <div className="flex items-center space-x-3 mb-4">*/}
          {/*      <div className="p-2 bg-violet-500/20 rounded-lg">*/}
          {/*        <Zap className="h-6 w-6 text-violet-400" />*/}
          {/*      </div>*/}
          {/*      <h3 className="text-xl font-semibold text-white">AI Opponent</h3>*/}
          {/*    </div>*/}
          {/*    <p className="text-gray-400">*/}
          {/*      Challenge our advanced AI with multiple difficulty levels, from beginner to unbeatable.*/}
          {/*    </p>*/}
          {/*  </CardContent>*/}
          {/*</Card>*/}

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Trophy className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white">Tournaments</h3>
              </div>
              <p className="text-gray-400">Compete in organized tournaments and climb the global leaderboards.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl text-center font-bold text-white">Stay tuned. Coming soon.</h2>
        {/*<div className="text-center bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-2xl p-12 border border-gray-700">*/}
          {/*<p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">*/}
          {/*  Be among the first to experience the LazyBall game.*/}
          {/*</p>*/}
          {/*<div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">*/}
          {/*  <Input*/}
          {/*      type="email"*/}
          {/*      placeholder="Your email address"*/}
          {/*      className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"*/}
          {/*  />*/}
          {/*  <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8">*/}
          {/*    Get Early Access*/}
          {/*  </Button>*/}
          {/*</div>*/}
        {/*</div>*/}
      </section>
      {/*<section className="container mx-auto px-4 py-16">*/}
      {/*  <div className="text-center bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-2xl p-12 border border-gray-700">*/}
      {/*    <h2 className="text-3xl font-bold text-white mb-4">Ready to Play?</h2>*/}
      {/*    <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">*/}
      {/*      Be among the first to experience the next generation of pong gaming. Sign up now to get notified when we*/}
      {/*      launch!*/}
      {/*    </p>*/}
      {/*    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">*/}
      {/*      <Input*/}
      {/*        type="email"*/}
      {/*        placeholder="Your email address"*/}
      {/*        className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"*/}
      {/*      />*/}
      {/*      <Button className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white px-8">*/}
      {/*        Get Early Access*/}
      {/*      </Button>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Gamepad2 className="h-6 w-6 text-violet-400" />
            <span className="text-xl font-bold text-white">LazyBall</span>
          </div>
          <p className="text-gray-400 text-sm">© 2025 LazyLab.io. Coming soon to revolutionize classic gaming.</p>
        </div>
      </footer>
    </div>
  )
}
