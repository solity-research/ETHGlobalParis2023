package main

import (
	ethGlobalParisUtils "ETHGlobalParis2023/execution/score/utils"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/ethereum/go-ethereum/ethclient"
	"github.com/joho/godotenv"
	"github.com/jung-kurt/gofpdf"
)

func generatePDF(caller string, status string, score float64) {
	// Create a new PDF
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)

	// Write content to the PDF
	pdf.Cell(40, 10, "CALLER: "+caller)
	pdf.Ln(12)
	pdf.Cell(40, 10, "STATUS: "+status)
	pdf.Ln(12)
	pdf.Cell(40, 10, "SCORE: "+strconv.FormatFloat(score, 'f', 2, 64))

	outputPath := "./outputs"
	err := os.MkdirAll(outputPath, os.ModePerm)
	if err != nil {
		log.Fatalf("Failed to create directory: %v", err)
	}

	// Save the PDF
	err = pdf.OutputFileAndClose(filepath.Join(outputPath, "result.pdf"))
	if err != nil {
		log.Fatalf("Failed to generate PDF: %v", err)
	}
}

func main() {
	// Load the env
	if err := godotenv.Load("score.env"); err != nil {
		log.Fatalf("Failed to load the env vars: %v", err)
	}

	ethereumClient, err := ethclient.Dial(os.Getenv("RPC_URL_ETH"))
	if err != nil {
		log.Fatalf("Failed to initialize the blockchain client: %v", err)
	}

	polygonClient, err := ethclient.Dial(os.Getenv("RPC_URL_POLYGON"))
	if err != nil {
		log.Fatalf("Failed to initialize the blockchain client: %v", err)
	}

	temp := ethGlobalParisUtils.CalculateAAVEStatus(os.Getenv("TARGET_ADDRESS"), ethereumClient, polygonClient)
	if len(temp) <= 0 {
		log.Println("No asset info has been gathered")
		return
	}

	score, err := ethGlobalParisUtils.CalculateAAVEScore(temp)
	caller := os.Getenv("TARGET_ADDRESS")
	status := "SUCCESS"
	if err != nil {
		status = "FAIL"
	}

	// Generate PDF regardless of status
	generatePDF(caller, status, score)

	if status == "FAIL" {
		return
	}

	fmt.Println("STATUS: SUCCESS")
	fmt.Printf("SCORE: %v \n", score)
}
