#!/usr/bin/env python3
"""
SCK Policy LLM Fine-tuning Script
Uses PEFT/LoRA for efficient fine-tuning of 3-7B models
"""

import os
import json
import torch
from datasets import Dataset
from transformers import (
    AutoTokenizer, AutoModelForCausalLM, TrainingArguments,
    Trainer, DataCollatorForLanguageModeling
)
from peft import LoraConfig, get_peft_model, TaskType
import argparse

def load_dataset(file_path):
    """Load JSONL dataset and convert to HuggingFace format"""
    data = []
    with open(file_path, 'r') as f:
        for line in f:
            if line.strip():
                data.append(json.loads(line))
    
    # Convert to HF dataset format
    return Dataset.from_list(data)

def format_prompt(example):
    """Format training example as instruction-following prompt"""
    input_data = example['input']
    
    # Build system prompt
    system_prompt = f"""You are a Policy LLM for the SCK Platform.

Role: {input_data['role_template']}
Trust Level: {input_data['agent_trust_level']}
Environment: {input_data['environment']}
Endpoint: {input_data['endpoint']}
Urgency: {input_data['urgency']}

Recent Trust Signals: {json.dumps(input_data['recent_signals'])}
Context Snippets: {json.dumps(input_data['context_snippets'])}

Respond with ONLY valid JSON according to this schema:
{{
  "action": "string",
  "endpoint": "string", 
  "arguments": {{}},
  "requiresApproval": boolean,
  "approvalsNeeded": ["string"],
  "justification": "string",
  "sources": [{{"id": "string", "score": number}}],
  "confidence": number,
  "riskAssessment": "LOW|MEDIUM|HIGH|CRITICAL",
  "complianceNotes": ["string"]
}}

Response:"""

    # Combine system prompt with expected output
    full_prompt = system_prompt + "\n" + example['output']
    
    return {"text": full_prompt}

def main():
    parser = argparse.ArgumentParser(description="Fine-tune Policy LLM with PEFT")
    parser.add_argument("--model_name", default="microsoft/DialoGPT-medium", 
                       help="Base model to fine-tune")
    parser.add_argument("--train_file", required=True, help="Training JSONL file")
    parser.add_argument("--output_dir", required=True, help="Output directory")
    parser.add_argument("--epochs", type=int, default=3, help="Training epochs")
    parser.add_argument("--batch_size", type=int, default=4, help="Batch size")
    parser.add_argument("--lr", type=float, default=3e-4, help="Learning rate")
    parser.add_argument("--lora_r", type=int, default=8, help="LoRA rank")
    parser.add_argument("--lora_alpha", type=int, default=32, help="LoRA alpha")
    parser.add_argument("--max_seq_length", type=int, default=1024, help="Max sequence length")
    
    args = parser.parse_args()
    
    print(f"🚀 Starting Policy LLM fine-tuning...")
    print(f"Model: {args.model_name}")
    print(f"Training file: {args.train_file}")
    print(f"Output dir: {args.output_dir}")
    
    # Load and prepare dataset
    print("📊 Loading dataset...")
    dataset = load_dataset(args.train_file)
    formatted_dataset = dataset.map(format_prompt, remove_columns=dataset.column_names)
    
    print(f"Dataset size: {len(formatted_dataset)} examples")
    
    # Load tokenizer and model
    print("🔧 Loading model and tokenizer...")
    tokenizer = AutoTokenizer.from_pretrained(args.model_name)
    model = AutoModelForCausalLM.from_pretrained(
        args.model_name,
        torch_dtype=torch.float16,
        device_map="auto"
    )
    
    # Add padding token if missing
    if tokenizer.pad_token is None:
        tokenizer.pad_token = tokenizer.eos_token
    
    # Configure LoRA
    print("🎯 Configuring LoRA...")
    lora_config = LoraConfig(
        task_type=TaskType.CAUSAL_LM,
        r=args.lora_r,
        lora_alpha=args.lora_alpha,
        lora_dropout=0.1,
        target_modules=["q_proj", "v_proj", "k_proj", "o_proj"]
    )
    
    model = get_peft_model(model, lora_config)
    model.print_trainable_parameters()
    
    # Tokenize dataset
    print("🔤 Tokenizing dataset...")
    def tokenize_function(examples):
        return tokenizer(
            examples["text"],
            truncation=True,
            padding=True,
            max_length=args.max_seq_length
        )
    
    tokenized_dataset = formatted_dataset.map(
        tokenize_function, 
        batched=True, 
        remove_columns=formatted_dataset.column_names
    )
    
    # Training arguments
    training_args = TrainingArguments(
        output_dir=args.output_dir,
        num_train_epochs=args.epochs,
        per_device_train_batch_size=args.batch_size,
        gradient_accumulation_steps=8,
        learning_rate=args.lr,
        fp16=True,
        logging_steps=100,
        save_steps=500,
        save_total_limit=2,
        remove_unused_columns=False,
        push_to_hub=False,
        report_to=None,
    )
    
    # Initialize trainer
    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=tokenized_dataset,
        data_collator=DataCollatorForLanguageModeling(tokenizer, mlm=False),
    )
    
    # Start training
    print("🏋️ Starting training...")
    trainer.train()
    
    # Save model
    print("💾 Saving model...")
    trainer.save_model()
    tokenizer.save_pretrained(args.output_dir)
    
    print(f"✅ Training complete! Model saved to {args.output_dir}")
    print(f"🎯 LoRA adapter saved to {args.output_dir}")

if __name__ == "__main__":
    main()
