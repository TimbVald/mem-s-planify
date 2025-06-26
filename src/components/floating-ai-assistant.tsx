/* eslint-disable react/no-unescaped-entities */
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { askQuestion } from '@/app/(protected)/dashboard/action'
import { readStreamableValue } from 'ai/rsc'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import useProject from '@/hooks/use-project'
import { 
  MessageCircle, 
  X, 
  Send, 
  Sparkles, 
  Loader2, 
  Minimize2
} from 'lucide-react'
import Image from 'next/image'

interface Message {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const FloatingAIAssistant = () => {
  const { project } = useProject()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [currentResponse, setCurrentResponse] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const savedAnswer = api.project.saveAnswer.useMutation()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, currentResponse])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !project?.id) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)
    setCurrentResponse('')

    try {
      const { output, filesReferences } = await askQuestion(message, project.id)
      
      let fullResponse = ''
      for await (const delta of readStreamableValue(output)) {
        if (delta) {
          fullResponse += delta
          setCurrentResponse(fullResponse)
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: fullResponse,
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])
      setCurrentResponse('')

      // Save the answer
      if (project.id) {
        savedAnswer.mutate({
          question: message,
          answer: fullResponse,
          projectId: project.id
        })
      }

      toast.success('Réponse générée avec succès!')
    } catch (error) {
      console.error('Error asking question:', error)
      toast.error('Erreur lors de la génération de la réponse')
    } finally {
      setIsLoading(false)
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
    if (isExpanded) {
      setIsMinimized(false)
    }
  }

  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={toggleMinimized}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isExpanded ? (
        <Button
          onClick={toggleExpanded}
          size="lg"
          className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card className="w-96 h-[500px] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-0 h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Image src="/logo.png" alt="Mem's Planify" width={32} height={32} className="rounded-lg" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-semibold">Mem's AI</h3>
                  <p className="text-xs text-blue-100">Assistant intelligent</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleMinimized}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleExpanded}
                  className="h-8 w-8 p-0 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 mx-auto bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Sparkles className="h-6 w-6 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">Bonjour ! 👋</h4>
                  <p className="text-sm text-gray-600">
                    Je suis Mem's AI, votre assistant personnel. Posez-moi vos questions sur votre projet !
                  </p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {msg.timestamp.toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
              
              {/* Current response being streamed */}
              {isLoading && currentResponse && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg p-3 bg-gray-100 text-gray-900">
                    <p className="text-sm whitespace-pre-wrap">{currentResponse}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                      <span className="text-xs text-gray-500">En train d'écrire...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t bg-gray-50">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Posez votre question..."
                  disabled={isLoading}
                  className="flex-1 min-h-[40px] max-h-[100px] resize-none text-sm"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e as any)
                    }
                  }}
                />
                <Button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FloatingAIAssistant

