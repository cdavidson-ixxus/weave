package com.pearson.chaski.ui.controller;

import java.io.File;

public class Rename {
	public static void main(String[] args) {
		String dir = "C:\\dev\\alfrescos\\42c\\tomcat\\webapps\\ROOT\\thumbnails";
		File fileDir = new File(dir);
		File[] files = fileDir.listFiles();
		for (int i = 0; i < files.length; i++) {
			if(files[i].getName().startsWith("thumbnails")){
				File newFile = new File(dir + "\\"+ files[i].getName().substring(10));
				System.out.println(newFile.getAbsolutePath());
				files[i].renameTo(newFile);
			}
		}
	}
}
