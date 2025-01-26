import { useEffect, useState } from "react";
import { useGameRoom } from "@/hooks/useGameRoom";
import useWindowSize from "@/hooks/useWindowResize";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import { Router, Routes, Route } from "react-router-dom";

interface GameProps {
	username: string;
	roomId: string;
}

const useStyles = makeStyles({}) as any;

const Game = ({ username, roomId }: GameProps) => {
	const { gameState, dispatch } = useGameRoom(username, roomId);
	const styles = useStyles();
	const windowSize = useWindowSize();

	return <></>;
};

export default Game;
